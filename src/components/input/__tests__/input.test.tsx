import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'
import Input, { InputProps } from '../input'

const renderComponent = (props: InputProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Input {...props} />
		</ThemeProvider>
	)
}

const generateProps = ({ value }: { value?: string | number }): InputProps => {
	return {
		label: 'Testing',
		name: 'Test',
		value,
		onChange: vi.fn(),
	}
}

describe('Input', () => {
	test('should render', () => {
		const props = generateProps({})

		render(renderComponent(props))

		expect(screen.getByText(props.label)).toBeTruthy()
		expect(document.getElementById(props.name)).toBeTruthy()
	})

	test('should has the value passed by props', () => {
		const props = generateProps({ value: 'test' })

		render(renderComponent(props))

		expect(screen.getByDisplayValue(props.value || '')).toBeTruthy()
	})

	test('should call the onChange', () => {
		const props = generateProps({})
		const value = 'random value'

		render(renderComponent(props))

		fireEvent.change(document.getElementById(props.name) as HTMLElement, {
			target: { value },
		})

		expect(screen.getByDisplayValue(value)).toBeTruthy()
		expect(props.onChange).toHaveBeenCalled()
	})

	test('should start empty when no value is given', () => {
		render(
			<ThemeProvider theme={DarkTheme}>
				<Input name="name" label="Name" onChange={vi.fn()} />
			</ThemeProvider>,
		)

		expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('')
	})
})
