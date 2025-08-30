import type { CompiledQuery, DatabaseConnection, QueryResult } from 'kysely'

export interface Client {
	query: (
		sql: string,
		parameters: unknown[],
	) => Promise<{
		command: string
		rowCount: number
		rows: unknown[]
	}>
	release?: () => void
}

export const PRIVATE_RELEASE_METHOD = Symbol('release')

export class NeonConnection implements DatabaseConnection {
	readonly #client: Client

	constructor(client: Client) {
		this.#client = client
	}

	async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
		const result = await this.#client.query(compiledQuery.sql, [
			...compiledQuery.parameters,
		])

		const rows = (result.rows ?? []) as never

		if (
			result.command === 'INSERT' ||
			result.command === 'UPDATE' ||
			result.command === 'DELETE'
		) {
			const numAffectedRows = BigInt(result.rowCount)

			return { numAffectedRows, rows }
		}

		return { rows }
	}

	// biome-ignore lint/correctness/useYield: no point in using yield here.
	async *streamQuery<O>(
		_compiledQuery: CompiledQuery,
		_chunkSize: number,
	): AsyncIterableIterator<QueryResult<O>> {
		throw new Error('Neon Driver does not support streaming')
	}

	[PRIVATE_RELEASE_METHOD](): void {
		this.#client.release?.()
	}
}
