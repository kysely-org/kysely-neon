import {
	type DatabaseIntrospector,
	type Dialect,
	type DialectAdapter,
	type Driver,
	type Kysely,
	PostgresIntrospector,
	PostgresQueryCompiler,
	type QueryCompiler,
} from 'kysely'
import { NeonAdapter } from './adapter.mjs'
import type { NeonDialectConfig } from './dialect-config.mjs'
import { NeonDriver } from './driver.mjs'
import { freeze } from './utils.mjs'

export class NeonDialect implements Dialect {
	readonly #config: NeonDialectConfig

	constructor(config: NeonDialectConfig) {
		this.#config = freeze({ ...config })
	}

	createAdapter(): DialectAdapter {
		return new NeonAdapter()
	}

	createDriver(): Driver {
		return new NeonDriver(this.#config)
	}

	// biome-ignore lint/suspicious/noExplicitAny: perfectly fine.
	createIntrospector(db: Kysely<any>): DatabaseIntrospector {
		return new PostgresIntrospector(db)
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler()
	}
}
