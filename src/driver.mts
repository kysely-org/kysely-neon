import type {
	CompiledQuery,
	DatabaseConnection,
	Driver,
	QueryResult,
	TransactionSettings,
} from 'kysely'
import type {
	NeonClient,
	NeonDialectConfig,
	NeonQueryResult,
} from './dialect-config.mjs'

export class NeonDriver implements Driver {
	readonly #config: NeonDialectConfig
	#connection: DatabaseConnection | undefined

	constructor(config: NeonDialectConfig) {
		this.#config = config
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		// biome-ignore lint/style/noNonNullAssertion: `init` has already run at least once.
		return this.#connection!
	}

	async beginTransaction(
		_connection: DatabaseConnection,
		_settings: TransactionSettings,
	): Promise<void> {
		throw new Error(
			"NeonDialect doesn't support interactive transactions, while Kysely doesn't support batch requests (yet).",
		)
	}

	async commitTransaction(_connection: DatabaseConnection): Promise<void> {
		// noop
	}

	async destroy(): Promise<void> {
		// noop
	}

	async init(): Promise<void> {
		const { neon } = this.#config

		this.#connection ||= new NeonDatabaseConnection(
			isNeon(neon) ? neon : await neon(),
		)
	}

	async releaseConnection(_connection: DatabaseConnection): Promise<void> {
		// noop
	}

	async rollbackTransaction(_connection: DatabaseConnection): Promise<void> {
		// noop
	}
}

function isNeon(thing: unknown): thing is NeonClient {
	return (
		typeof thing === 'function' && 'query' in thing && 'transaction' in thing
	)
}

class NeonDatabaseConnection implements DatabaseConnection {
	readonly #neon: NeonClient

	constructor(neon: NeonClient) {
		this.#neon = neon
	}

	async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
		const result: NeonQueryResult = await this.#neon.query(
			compiledQuery.sql,
			[...compiledQuery.parameters],
			{ arrayMode: false, fullResults: true },
		)

		const { command, rowCount, rows } = result

		return {
			numAffectedRows:
				command === 'INSERT' ||
				command === 'UPDATE' ||
				command === 'DELETE' ||
				command === 'MERGE'
					? BigInt(rowCount)
					: undefined,
			rows: (rows ?? []) as never,
		}
	}

	streamQuery<R>(
		_compiledQuery: CompiledQuery,
		_chunkSize?: number,
	): AsyncIterableIterator<QueryResult<R>> {
		throw new Error("NeonDialect doesn't support streaming.")
	}
}
