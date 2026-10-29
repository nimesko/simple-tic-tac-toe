import { render } from '@testing-library/react'
import React from 'react'
import CircleIcon from '../circle-icon'

describe('CircleIcon', () => {
	test('should render', () => {
		const { container } = render(<CircleIcon />)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be hidden from assistive technologies', () => {
		const { container } = render(<CircleIcon />)

		const svg = container.querySelector('svg') as SVGElement

		expect(svg.getAttribute('aria-hidden')).toBe('true')
		expect(svg.getAttribute('focusable')).toBe('false')
	})
})
