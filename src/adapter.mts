import { PostgresAdapter } from 'kysely'

export class NeonAdapter extends PostgresAdapter {
	override get supportsTransactionalDdl(): boolean {
		return false
	}
}
