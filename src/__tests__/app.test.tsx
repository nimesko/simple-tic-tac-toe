import { render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'

vi.mock('../pages/home/home', () => ({
	default: () => <div>home page</div>,
}))

// React.lazy caches the loaded module, so every test gets a fresh App
const renderApp = async () => {
	vi.resetModules()
	const { default: App } = await import('../app')
	return render(
		<ThemeProvider theme={DarkTheme}>
			<App />
		</ThemeProvider>,
	)
}

describe('App', () => {
	test('should show the loading until the home page is loaded', async () => {
		const { container } = await renderApp()

		expect(screen.queryByText('home page')).toBeNull()
		expect(container.querySelector('div > div')).not.toBeNull()

		expect(await screen.findByText('home page')).toBeTruthy()
	})

	test('should render the home page on any route', async () => {
		window.history.pushState({}, '', '/any/route')

		await renderApp()

		expect(await screen.findByText('home page')).toBeTruthy()
	})
})
