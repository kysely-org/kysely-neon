import { defineConfig } from 'tsdown'

export default defineConfig({
	attw: {
		enabled: true,
		profile: 'esm-only',
	},
	entry: 'src/index.mts',
	exports: true,
	publint: true,
})
