/**
 * This script aligns docs site package.json AND jsr versions with
 * Kysely's version so we use only the latest published version in the docs and JSR publish.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import jsrJson from '../deno.json' with { type: 'json' }
import pkgJson from '../package.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

const { devDependencies, version } = pkgJson

writeFileSync(
	join(__dirname, '../deno.json'),
	`${JSON.stringify(
		{
			...jsrJson,
			imports: {
				kysely: `jsr:@kysely/kysely@${devDependencies.kysely.replace('^', '')}`,
			},
			version,
		},
		null,
		2,
	)}\n`,
)
