import { render, screen } from '@testing-library/react'
import React from 'react'
import Loading from '../loading'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'

describe('Loading', () => {
	test('should render', () => {
		const { container } = render(
			<ThemeProvider theme={DarkTheme}>
				<Loading />
			</ThemeProvider>,
		)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be announced as a progress bar', () => {
		render(
			<ThemeProvider theme={DarkTheme}>
				<Loading />
			</ThemeProvider>,
		)

		expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy()
	})
})
