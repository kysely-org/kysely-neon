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

			expect(result).toMatchSnapshot()
		})
	})
}
