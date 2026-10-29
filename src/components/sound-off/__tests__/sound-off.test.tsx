import { render } from '@testing-library/react'
import React from 'react'
import SoundOff from '../sound-off'

describe('SoundOff', () => {
	test('should render', () => {
		const { container } = render(<SoundOff />)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be hidden from assistive technologies', () => {
		const { container } = render(<SoundOff />)

		const svg = container.querySelector('svg') as SVGElement

		expect(svg.getAttribute('aria-hidden')).toBe('true')
		expect(svg.getAttribute('focusable')).toBe('false')
	})
})
