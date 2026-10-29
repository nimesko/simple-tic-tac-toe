import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'
import ToggleSound, { ToggleSoundProps } from '../toggle-sound'
import { fireEvent, render } from '@testing-library/react'

const generateProps = ({
	isSoundEnabled,
}: {
	isSoundEnabled: boolean
}): Required<ToggleSoundProps> => {
	return {
		isSoundEnabled,
		onChange: vi.fn(),
	}
}

const renderComponent = (props: ToggleSoundProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<ToggleSound {...props} />
		</ThemeProvider>
	)
}

describe('ToggleSound', () => {
	test('should render component with sound enabled', () => {
		const props = generateProps({ isSoundEnabled: true })

		const { container } = render(renderComponent(props))

		expect(container.firstChild).toBeTruthy()
		expect(document.querySelector('svg')).toBeTruthy()
	})

	test('should render component with sound disabled', () => {
		const props = generateProps({ isSoundEnabled: false })

		const { container } = render(renderComponent(props))

		expect(container.firstChild).toBeTruthy()
		expect(document.querySelector('svg')).toBeTruthy()
	})

	test('should call onChange', () => {
		const props = generateProps({ isSoundEnabled: true })

		const { container } = render(renderComponent(props))

		fireEvent.click(container.querySelector('button') as HTMLButtonElement)

		expect(props.onChange).toHaveBeenCalledTimes(1)
	})
})
