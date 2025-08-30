export interface NeonHTTPDialectConfig {
	neon: NeonHTTPClient | (() => NeonHTTPClient | Promise<NeonHTTPClient>)
}

export interface NeonHTTPClient {
	query: (
		queryWithPlaceholders: string,
		// biome-ignore lint/suspicious/noExplicitAny: this is coming from neon.
		params?: any[] | undefined,
		queryOpts?: NeonHTTPQueryOptions | undefined,
		// biome-ignore lint/suspicious/noExplicitAny: we want to match anything, and later narrow when passing necessary query options.
	) => Promise<any>
}

interface NeonHTTPQueryOptions {
	arrayMode?: boolean
	fullResults?: boolean
}

export interface NeonHTTPQueryResult {
	command: string
	rowCount: number
	// biome-ignore lint/suspicious/noExplicitAny: this is coming from neon.
	rows: Record<string, any>[]
}
