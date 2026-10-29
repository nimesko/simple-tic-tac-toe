import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import {
	DarkTheme,
	GlobalStyle,
	LightTheme,
	MediaQueries,
	Sizes,
} from '../theme'

const renderGlobalStyles = (theme: typeof DarkTheme) => {
	const sheet = new ServerStyleSheet()
	try {
		renderToString(
			sheet.collectStyles(
				<ThemeProvider theme={theme}>
					<GlobalStyle />
				</ThemeProvider>,
			),
		)
		return sheet.getStyleTags()
	} finally {
		sheet.seal()
	}
}

describe('theme', () => {
	test('should expose the dark and light themes', () => {
		expect(DarkTheme.name).toBe('dark')
		expect(LightTheme.name).toBe('light')
		expect(DarkTheme.color.background).not.toBe(LightTheme.color.background)
	})

	test('should build the media queries from the sizes', () => {
		expect(MediaQueries.xs).toBe(`(min-width: ${Sizes.xs})`)
		expect(MediaQueries.sm).toBe(`(min-width: ${Sizes.sm})`)
	})

	test.each([
		['dark', DarkTheme],
		['light', LightTheme],
	])('should apply the %s theme colors on the body', (_, theme) => {
		const styles = renderGlobalStyles(theme)

		expect(styles).toContain(`background-color:${theme.color.background}`)
		expect(styles).toContain(`color:${theme.color.colorText}`)
	})

	test.each([
		['dark', DarkTheme],
		['light', LightTheme],
	])(
		'should respect reduced motion and let the page scroll in the %s theme',
		(_, theme) => {
			const styles = renderGlobalStyles(theme)

			expect(styles).toContain('@media (prefers-reduced-motion: reduce)')
			expect(styles).toContain('animation-iteration-count:1!important')
			expect(styles).toContain('overflow:auto')
			expect(styles).not.toContain('overflow:hidden')
		},
	)
})
