export interface NeonDialectConfig {
	neon: NeonClient | (() => NeonClient | Promise<NeonClient>)
}

export interface NeonClient {
	query: (
		queryWithPlaceholders: string,
		// biome-ignore lint/suspicious/noExplicitAny: this is coming from neon.
		params?: any[] | undefined,
		queryOpts?: NeonQueryOptions | undefined,
		// biome-ignore lint/suspicious/noExplicitAny: we want to match anything, and later narrow when passing necessary query options.
	) => Promise<any>
}

interface NeonQueryOptions {
	arrayMode?: boolean
	fullResults?: boolean
}

export interface NeonQueryResult {
	command: string
	rowCount: number
	// biome-ignore lint/suspicious/noExplicitAny: this is coming from neon.
	rows: Record<string, any>[]
}
