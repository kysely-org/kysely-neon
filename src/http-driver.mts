import type {
	CompiledQuery,
	DatabaseConnection,
	Driver,
	QueryResult,
	TransactionSettings,
} from 'kysely'
import type {
	NeonHTTPClient,
	NeonHTTPDialectConfig,
	NeonHTTPQueryResult,
} from './http-dialect-config.mjs'

export class NeonHTTPDriver implements Driver {
	readonly #config: NeonHTTPDialectConfig
	#connection: DatabaseConnection | undefined

	constructor(config: NeonHTTPDialectConfig) {
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
			"NeonHTTPDialect doesn't support interactive transactions, while Kysely doesn't support batch requests (yet).",
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

		this.#connection ||= new NeonHTTPDatabaseConnection(
			isNeonHTTPClient(neon) ? neon : await neon(),
		)
	}

	async releaseConnection(_connection: DatabaseConnection): Promise<void> {
		// noop
	}

	async rollbackTransaction(_connection: DatabaseConnection): Promise<void> {
		// noop
	}
}

function isNeonHTTPClient(thing: unknown): thing is NeonHTTPClient {
	return (
		typeof thing === 'function' && 'query' in thing && 'transaction' in thing
	)
}

class NeonHTTPDatabaseConnection implements DatabaseConnection {
	readonly #neon: NeonHTTPClient

	constructor(neon: NeonHTTPClient) {
		this.#neon = neon
	}

	async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
		const result: NeonHTTPQueryResult = await this.#neon.query(
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
		throw new Error("NeonHTTPDialect doesn't support streaming.")
	}
}
