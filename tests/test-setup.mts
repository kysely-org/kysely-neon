import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { type Generated, Kysely, PostgresDialect } from 'kysely'
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
		id: Generated<string>
		name: string
	}
}

export async function initTest(
	dialect: keyof typeof DIALECTS,
): Promise<TestContext> {
	return { db: new Kysely({ dialect: DIALECTS[dialect] }) }
}

export async function resetState(): Promise<void> {
	await neon(CONNECTION_STRING).transaction((trx) => [
		trx`drop table if exists person`,
		trx`create table person (id uuid primary key default gen_random_uuid(), name varchar(255) unique not null)`,
		trx`insert into person (id, name) values ('48856ed4-9f1f-4111-ba7f-6092a1be96eb', 'moshe'), ('28175ebc-02ec-4c87-9a84-b3d25193fefa', 'haim'), ('cbbffbea-47d5-40ec-a98d-518b48e2bb5d', 'rivka'), ('d2b76f94-1a33-4b8c-9226-7d35390b1112', 'henry')`,
	])
}
