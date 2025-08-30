import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
	initTest,
	resetState,
	SUPPORTED_DIALECTS,
	type TestContext,
} from './test-setup.mjs'

for (const dialect of SUPPORTED_DIALECTS) {
	describe(`neon: ${dialect}`, () => {
		let ctx: TestContext

		beforeAll(async () => {
			ctx = await initTest(dialect)
		})

		beforeEach(async () => {
			await resetState()
		})

		it('should execute select queries', async () => {
			const result = await ctx.db.selectFrom('person').selectAll().execute()

			expect(result).toMatchSnapshot([
				{ id: '48856ed4-9f1f-4111-ba7f-6092a1be96eb', name: 'moshe' },
				{ id: '28175ebc-02ec-4c87-9a84-b3d25193fefa', name: 'haim' },
				{ id: 'cbbffbea-47d5-40ec-a98d-518b48e2bb5d', name: 'rivka' },
			])
		})
	})
}
