import { render, screen } from '@testing-library/react'
import React from 'react'
import VisuallyHidden from '../visually-hidden'

describe('VisuallyHidden', () => {
	test('should keep the content in the page for assistive technologies', () => {
		render(<VisuallyHidden>Only for screen readers</VisuallyHidden>)

		expect(screen.getByText('Only for screen readers')).toBeTruthy()
	})

	test('should render as the given element', () => {
		const { container } = render(<VisuallyHidden as="div">Text</VisuallyHidden>)

		expect(container.querySelector('div')).toBeTruthy()
	})
})
