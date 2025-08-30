import {
	CompiledQuery,
	type DatabaseConnection,
	type DatabaseIntrospector,
	type Dialect,
	type Driver,
	type Kysely,
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
	type QueryCompiler,
	type TransactionSettings,
} from 'kysely'
import {
	type ClientConfig,
	type NeonConfig,
	Pool,
	type PoolClient,
	neonConfig,
} from '@neondatabase/serverless'
import { NeonConnection, PRIVATE_RELEASE_METHOD } from './neon-connection.mjs'

type NeonDialectConfig = ClientConfig & Partial<NeonConfig>

export class NeonDialect implements Dialect {
	readonly #config: NeonDialectConfig

	constructor(config: NeonDialectConfig) {
		this.#config = config
	}

	createAdapter() {
		return new PostgresAdapter()
	}

	createDriver(): Driver {
		return new NeonDriver(this.#config)
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler()
	}

	// biome-ignore lint/suspicious/noExplicitAny: perfectly fine.
	createIntrospector(db: Kysely<any>): DatabaseIntrospector {
		return new PostgresIntrospector(db)
	}
}

class NeonDriver implements Driver {
	readonly #config: NeonDialectConfig
	readonly #connections = new WeakMap<PoolClient, DatabaseConnection>()
	#pool?: Pool

	constructor(config: NeonDialectConfig) {
		this.#config = config
	}

	async init(): Promise<void> {
		Object.assign(neonConfig, this.#config)
		this.#pool = new Pool(this.#config)
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		// biome-ignore lint/style/noNonNullAssertion: `init` always happens before `acquireConnection`.
		const client = await this.#pool!.connect()
		let connection = this.#connections.get(client)

		if (!connection) {
			connection = new NeonConnection(client)
			this.#connections.set(client, connection)
		}

		return connection
	}

	async beginTransaction(
		conn: NeonConnection,
		settings: TransactionSettings,
	): Promise<void> {
		if (settings.isolationLevel) {
			await conn.executeQuery(
				CompiledQuery.raw(
					`start transaction isolation level ${settings.isolationLevel}`,
				),
			)
		} else {
			await conn.executeQuery(CompiledQuery.raw('begin'))
		}
	}

	async commitTransaction(conn: NeonConnection): Promise<void> {
		await conn.executeQuery(CompiledQuery.raw('commit'))
	}

	async rollbackTransaction(conn: NeonConnection): Promise<void> {
		await conn.executeQuery(CompiledQuery.raw('rollback'))
	}

	async releaseConnection(connection: NeonConnection): Promise<void> {
		connection[PRIVATE_RELEASE_METHOD]()
	}

	async destroy(): Promise<void> {
		if (this.#pool) {
			const pool = this.#pool
			this.#pool = undefined
			await pool.end()
		}
	}
}
