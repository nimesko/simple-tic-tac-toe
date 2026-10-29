import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'
import Button, { ButtonProps } from '../button'

const renderComponent = (props: ButtonProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Button {...props} />
		</ThemeProvider>
	)
}

const generateProps = ({
	hasClickEvent,
}: {
	hasClickEvent: boolean
}): ButtonProps => {
	return {
		children: 'Button',
		onClick: hasClickEvent ? vi.fn() : undefined,
	}
}

describe('Button', () => {
	test('should render', () => {
		const props = generateProps({ hasClickEvent: false })

		render(renderComponent(props))

		expect(screen.getByText(props.children as string)).toBeTruthy()
	})

	test('should call onClick', () => {
		const props = generateProps({ hasClickEvent: true })

		render(renderComponent(props))

		expect(screen.getByText(props.children as string)).toBeTruthy()

		fireEvent.click(screen.getByText(props.children as string))

		expect(props.onClick).toHaveBeenCalledTimes(1)
	})

	test('should not call onClick', () => {
		const props = generateProps({ hasClickEvent: false })

		render(renderComponent(props))

		expect(screen.getByText(props.children as string)).toBeTruthy()

		fireEvent.click(screen.getByText(props.children as string))
	})
})
