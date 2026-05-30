import { defineConfig } from 'tsdown'

export default defineConfig({
	attw: {
		enabled: true,
		profile: 'esm-only',
	},
	entry: 'src/index.mts',
	exports: {
		enabled: true,
	},
	publint: {
		enabled: true,
	},
})
