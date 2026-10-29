import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const isAnalyzing = process.env.ANALYZE === 'true'

export default defineConfig({
	base: process.env.NODE_ENV === 'production' ? '/simple-tic-tac-toe/' : './',
	plugins: [react(), isAnalyzing && visualizer({ open: true, gzipSize: true })],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 8080,
		open: true,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		clearMocks: true,
		include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
		coverage: {
			enabled: true,
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/__tests__/**', 'src/**/*.d.ts'],
			reporter: ['text-summary', 'json', 'html'],
			reportsDirectory: './coverage',
			thresholds: {
				statements: 95,
				branches: 95,
				functions: 95,
				lines: 95,
			},
		},
	},
})
