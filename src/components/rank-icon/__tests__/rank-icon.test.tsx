import { render } from '@testing-library/react'
import React from 'react'
import RankIcon from '../rank-icon'

describe('RankIcon', () => {
	test('should render', () => {
		const { container } = render(<RankIcon />)

		expect(container.firstChild).toBeTruthy()
	})

	test('should be hidden from assistive technologies', () => {
		const { container } = render(<RankIcon />)

		const svg = container.querySelector('svg') as SVGElement

		expect(svg.getAttribute('aria-hidden')).toBe('true')
		expect(svg.getAttribute('focusable')).toBe('false')
	})
})
