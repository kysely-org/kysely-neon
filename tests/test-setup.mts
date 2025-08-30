import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { type GeneratedAlways, Kysely, PostgresDialect } from 'kysely'
import { NeonHTTPDialect } from '..'

// https://neon.com/guides/local-development-with-neon#connect-your-app
const PROXY_HOST = 'db.localtest.me'
const PROXY_HTTP_PORT = 4444

neonConfig.fetchEndpoint = `http://${PROXY_HOST}:${PROXY_HTTP_PORT}/sql`
neonConfig.useSecureWebSocket = false
neonConfig.webSocketConstructor = WebSocket
neonConfig.wsProxy = `${PROXY_HOST}:${PROXY_HTTP_PORT}/v2`

const CONNECTION_STRING = `postgres://postgres:postgres@${PROXY_HOST}:5432/main`

const DIALECTS = {
	http: new NeonHTTPDialect({
		neon: () => neon(CONNECTION_STRING),
	}),
	ws: new PostgresDialect({
		pool: async () => new Pool({ connectionString: CONNECTION_STRING }),
	}),
} as const

export const SUPPORTED_DIALECTS = Object.keys(
	DIALECTS,
) as (keyof typeof DIALECTS)[]

export interface TestContext {
	db: Kysely<Database>
}

export interface Database {
	person: {
		id: GeneratedAlways<string>
		name: string
	}
}

export async function initTest(
	dialect: keyof typeof DIALECTS,
): Promise<TestContext> {
	return { db: new Kysely({ dialect: DIALECTS[dialect] }) }
}
