import { neon, neonConfig, Pool } from '@neondatabase/serverless'

const PROXY_HOST = 'db.localtest.me'
const PROXY_HTTP_PORT = 4444

neonConfig.fetchEndpoint = `http://${PROXY_HOST}:${PROXY_HTTP_PORT}/sql`
neonConfig.useSecureWebSocket = false
neonConfig.webSocketConstructor = WebSocket
neonConfig.wsProxy = `${PROXY_HOST}:${PROXY_HTTP_PORT}/v2`

const CONNECTION_STRING = `postgres://postgres:postgres@${PROXY_HOST}:5432/main`

export const CONFIGS = {
	http: {
		pool: new Pool({ connectionString: CONNECTION_STRING }),
	},
	ws: {
		neon: neon(CONNECTION_STRING),
	},
}
