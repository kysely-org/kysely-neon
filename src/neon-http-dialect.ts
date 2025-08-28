import {
  CompiledQuery,
  DatabaseConnection,
  DatabaseIntrospector,
  Dialect,
  Driver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  QueryCompiler,
  TransactionSettings,
} from "kysely"
import { neon } from "@neondatabase/serverless"
import { NeonConnection } from "neon-connection"

interface NeonHTTPDialectConfig {
  connectionString: string
}

export class NeonHTTPDialect implements Dialect {
  readonly #config: NeonHTTPDialectConfig

  constructor(config: NeonHTTPDialectConfig) {
    this.#config = config
  }

  createAdapter() {
    return new PostgresAdapter()
  }

  createDriver(): Driver {
    return new NeonHTTPDriver(this.#config)
  }

  createQueryCompiler(): QueryCompiler {
    return new PostgresQueryCompiler()
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new PostgresIntrospector(db)
  }
}

class NeonHTTPDriver implements Driver {
  readonly #config: NeonHTTPDialectConfig

  constructor(config: NeonHTTPDialectConfig) {
    this.#config = config
  }

  async init(): Promise<void> {
    // noop
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new NeonConnection({
      query: neon(this.#config.connectionString, { fullResults: true }).query,
    })
  }

  async beginTransaction(
    conn: NeonConnection,
    settings: TransactionSettings
  ): Promise<void> {
    if (settings.isolationLevel) {
      await conn.executeQuery(
        CompiledQuery.raw(
          `start transaction isolation level ${settings.isolationLevel}`
        )
      )
    } else {
      await conn.executeQuery(CompiledQuery.raw("begin"))
    }
  }

  async commitTransaction(conn: NeonConnection): Promise<void> {
    await conn.executeQuery(CompiledQuery.raw("commit"))
  }

  async rollbackTransaction(conn: NeonConnection): Promise<void> {
    await conn.executeQuery(CompiledQuery.raw("rollback"))
  }

  async releaseConnection(_: DatabaseConnection): Promise<void> {
    // noop
  }

  async destroy(): Promise<void> {
    // noop
  }
}
