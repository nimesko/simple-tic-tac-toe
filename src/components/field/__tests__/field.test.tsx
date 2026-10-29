import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Field, { FieldProps } from '../field'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'

const renderComponent = (props: FieldProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Field {...props} />
		</ThemeProvider>
	)
}

const generateProps = ({ player }: { player?: number }): FieldProps => {
	return {
		player: player,
		position: 1,
		size: 3,
		onClick: vi.fn(),
	}
}

describe('Field', () => {
	test('should render', () => {
		const props = generateProps({ player: 1 })

		const { container } = render(renderComponent(props))

		expect(container.firstChild).toBeTruthy()
	})

	test('should render player 1 or player 2', () => {
		;[generateProps({ player: 0 }), generateProps({ player: 1 })].forEach(
			(props) => {
				const { container } = render(renderComponent(props))
				expect(container.querySelector('svg')).toBeTruthy()
			},
		)
	})

	test('should not render svg icon', () => {
		const props = generateProps({ player: undefined })

		const { container } = render(renderComponent(props))

		expect(container.firstChild).toBeTruthy()
		expect(container.querySelector('svg')).not.toBeTruthy()
	})

	test('should call onClick', () => {
		const props = generateProps({ player: 1 })

		const { container } = render(renderComponent(props))

		fireEvent.click(container.querySelector('svg') as SVGSVGElement)

		expect(props.onClick).toHaveBeenCalledTimes(1)
	})

	describe('accessibility', () => {
		test('should be a button named by its position and content', () => {
			const cases: [number, number | undefined, string][] = [
				[0, undefined, 'Row 1, column 1, empty'],
				[1, 0, 'Row 1, column 2, X'],
				[5, 1, 'Row 2, column 3, O'],
				[8, undefined, 'Row 3, column 3, empty'],
			]

			cases.forEach(([position, player, name]) => {
				const { unmount } = render(
					renderComponent({ ...generateProps({ player }), position }),
				)

				expect(screen.getByRole('button', { name })).toBeTruthy()
				unmount()
			})
		})

		test('should not submit forms', () => {
			render(renderComponent(generateProps({})))

			expect(screen.getByRole('button').getAttribute('type')).toBe('button')
		})

		test('should be enabled by default and disabled on demand', () => {
			const { rerender } = render(renderComponent(generateProps({})))

			expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
				false,
			)

			rerender(renderComponent({ ...generateProps({}), disabled: true }))

			expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
				true,
			)
		})

		test.each(['{Enter}', ' '])(
			'should be activated with the %j key',
			async (key) => {
				const props = generateProps({})
				render(renderComponent(props))

				screen.getByRole('button').focus()
				await userEvent.keyboard(key)

				expect(props.onClick).toHaveBeenCalledWith({ position: 1 })
			},
		)
	})
})
