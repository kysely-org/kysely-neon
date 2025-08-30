import { neon } from '@neondatabase/serverless'
import {
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
import { NeonConnection } from './neon-connection.mjs'

interface NeonHTTPDialectConfig {
	connectionString: string
}

export class NeonHTTPDialect implements Dialect {
	readonly #config: NeonHTTPDialectConfig

	constructor(config: NeonHTTPDialectConfig) {
		this.#config = config
	}

	createAdapter() {
		return new PostgresAdapter()
	}

	createDriver(): Driver {
		return new NeonHTTPDriver(this.#config)
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler()
	}

	// biome-ignore lint/suspicious/noExplicitAny: perfectly fine.
	createIntrospector(db: Kysely<any>): DatabaseIntrospector {
		return new PostgresIntrospector(db)
	}
}

class NeonHTTPDriver implements Driver {
	readonly #config: NeonHTTPDialectConfig
	readonly #connection: NeonConnection

	constructor(config: NeonHTTPDialectConfig) {
		this.#config = config
		this.#connection = new NeonConnection({
			query: neon(this.#config.connectionString, { fullResults: true }),
		})
	}

	async init(): Promise<void> {
		// noop
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		return this.#connection
	}

	async beginTransaction(
		_: DatabaseConnection,
		__: TransactionSettings,
	): Promise<void> {
		throw new Error('Transactions are not supported with Neon HTTP connections')
	}

	async commitTransaction(_: DatabaseConnection): Promise<void> {
		throw new Error('Transactions are not supported with Neon HTTP connections')
	}

	async rollbackTransaction(_: DatabaseConnection): Promise<void> {
		throw new Error('Transactions are not supported with Neon HTTP connections')
	}

	async releaseConnection(_: DatabaseConnection): Promise<void> {
		// noop
	}

	async destroy(): Promise<void> {
		// noop
	}
}
