import { render } from '@testing-library/react'
import React from 'react'
import CrossIcon from '../cross-icon'

describe('CrossIcon', () => {
	test('should render', () => {
		const { container } = render(<CrossIcon />)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be hidden from assistive technologies', () => {
		const { container } = render(<CrossIcon />)

		const svg = container.querySelector('svg') as SVGElement

		expect(svg.getAttribute('aria-hidden')).toBe('true')
		expect(svg.getAttribute('focusable')).toBe('false')
	})
})
