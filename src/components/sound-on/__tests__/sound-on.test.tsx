import { render } from '@testing-library/react'
import React from 'react'
import SoundOn from '../sound-on'

describe('SoundOn', () => {
	test('should render', () => {
		const { container } = render(<SoundOn />)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be hidden from assistive technologies', () => {
		const { container } = render(<SoundOn />)

		const svg = container.querySelector('svg') as SVGElement

		expect(svg.getAttribute('aria-hidden')).toBe('true')
		expect(svg.getAttribute('focusable')).toBe('false')
	})
})
