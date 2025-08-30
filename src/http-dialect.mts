import {
	type DatabaseIntrospector,
	type Dialect,
	type Driver,
	type Kysely,
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
	type QueryCompiler,
} from 'kysely'
import type { NeonHTTPDialectConfig } from './http-dialect-config.mjs'
import { NeonHTTPDriver } from './http-driver.mjs'
import { freeze } from './utils.mjs'

export class NeonHTTPDialect implements Dialect {
	readonly #config: NeonHTTPDialectConfig

	constructor(config: NeonHTTPDialectConfig) {
		this.#config = freeze({ ...config })
	}

	createAdapter() {
		return new PostgresAdapter()
	}

	createDriver(): Driver {
		return new NeonHTTPDriver(this.#config)
	}

	// biome-ignore lint/suspicious/noExplicitAny: perfectly fine.
	createIntrospector(db: Kysely<any>): DatabaseIntrospector {
		return new PostgresIntrospector(db)
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler()
	}
}
