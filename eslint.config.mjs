import js from '@eslint/js'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['coverage', 'dist', 'node_modules'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	react.configs.flat.recommended,
	jsxA11y.flatConfigs.strict,
	{
		settings: { react: { version: 'detect' } },
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'never'],
		},
	},
)
