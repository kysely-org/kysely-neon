import { PostgresAdapter } from "kysely";

export class NeonAdapter extends PostgresAdapter {
  override get supportsTransactionalDdl() {
    return false
  }
}
