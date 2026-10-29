import { act, screen } from '@testing-library/react'
import React from 'react'
import reportWebVitals from '../report-web-vitals'

vi.mock('../app', () => ({
	default: () => <div>app</div>,
}))

vi.mock('../report-web-vitals', () => ({
	default: vi.fn(),
}))

const loadMain = async () => {
	vi.resetModules()
	await act(async () => {
		await import('../main')
	})
}

describe('main', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	test('should render the application into the root element', async () => {
		document.body.innerHTML = '<div id="root"></div>'

		await loadMain()

		expect(await screen.findByText('app')).toBeTruthy()
		expect(document.getElementById('root')?.textContent).toBe('app')
		expect(reportWebVitals).toHaveBeenCalledTimes(1)
	})

	test('should warn when the root element is missing', async () => {
		await loadMain()

		expect(document.body.innerText).toBe(
			'Unable to render application, missing root element',
		)
		expect(reportWebVitals).not.toHaveBeenCalled()
	})
})
