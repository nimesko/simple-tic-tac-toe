import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import FormPlayer, { FormPlayerProps } from '../form-player'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'

const renderComponent = (props: FormPlayerProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<FormPlayer {...props} />
		</ThemeProvider>
	)
}

const generateProps = ({ name }: { name: string }): FormPlayerProps => {
	return {
		value: { name },
		onSubmit: vi.fn(),
	}
}

describe('FormPlayer', () => {
	test('should render', () => {
		const props = generateProps({ name: '' })

		const { container } = render(renderComponent(props))

		expect(container.firstChild).toBeTruthy()
	})

	test('should change the name input', () => {
		const props = generateProps({ name: '' })
		const value = 'testing'

		render(renderComponent(props))

		fireEvent.change(document.querySelector('input') as HTMLInputElement, {
			target: { value },
		})

		expect(screen.getByDisplayValue(value)).toBeTruthy()
	})

	test('should not propagate click events', () => {
		const props = generateProps({ name: '' })

		render(renderComponent(props))

		const mockOnClick = vi.fn()

		document.addEventListener('click', mockOnClick)

		fireEvent.click(document.querySelector('input') as HTMLInputElement)

		expect(mockOnClick).not.toHaveBeenCalled()

		document.removeEventListener('click', mockOnClick)
	})

	test('should call onSubmit', () => {
		const props = generateProps({ name: 'testing' })

		render(renderComponent(props))

		fireEvent.submit(document.querySelector('form') as HTMLFormElement)

		expect(props.onSubmit).toHaveBeenCalledTimes(1)
	})
})
