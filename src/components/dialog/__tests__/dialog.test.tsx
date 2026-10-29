import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'
import Dialog, { DialogProps } from '../dialog'

const renderComponent = (props: DialogProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Dialog {...props} />
		</ThemeProvider>
	)
}

const generateProps = ({ isVisible }: { isVisible: boolean }): DialogProps => {
	return {
		children: <div>Testing</div>,
		isVisible,
		title: 'Testing dialog',
		onClose: vi.fn(),
	}
}

describe('Dialog', () => {
	beforeAll(() => {
		const divElement = document.createElement('div')
		divElement.id = 'modal-root'
		document.body.appendChild(divElement)
	})

	afterAll(() => {
		document.getElementById('modal-root')?.remove()
	})

	test('should render', () => {
		const props = generateProps({ isVisible: true })

		render(renderComponent(props))

		expect(
			document.getElementById('modal-root')?.children.length,
		).toBeGreaterThan(0)
	})

	test('should render nothing', () => {
		const props = generateProps({ isVisible: false })

		render(renderComponent(props))

		expect(document.getElementById('modal-root')?.children.length).toBe(0)
	})

	test('should call onClose when clicking away', () => {
		const props = generateProps({ isVisible: true })

		render(renderComponent(props))

		fireEvent.click(document.querySelector('dialog') as HTMLDialogElement)

		expect(props.onClose).toHaveBeenCalledTimes(1)
	})

	test('should not call onClose when hitting other keys expect Esc', () => {
		const props = generateProps({ isVisible: true })

		render(renderComponent(props))

		const keys = ['1', 'a', 'Shift', 'Space']

		keys.forEach((key: string) => {
			fireEvent.keyUp(document.body, { key })
		})

		expect(props.onClose).not.toHaveBeenCalled()
	})

	test('should call onClose when hitting Esc key', () => {
		const props = generateProps({ isVisible: true })

		render(renderComponent(props))

		fireEvent.keyUp(document.body, { key: 'Escape' })

		expect(props.onClose).toHaveBeenCalledTimes(1)
	})
	describe('accessibility', () => {
		const withButtons = (props: DialogProps): DialogProps => ({
			...props,
			children: (
				<>
					<button>First</button>
					<button>Second</button>
				</>
			),
		})

		test('should be named by its title', () => {
			render(renderComponent(generateProps({ isVisible: true })))

			const dialog = screen.getByRole('dialog', { name: 'Testing dialog' })

			expect(dialog.getAttribute('aria-modal')).toBe('true')
		})

		test('should focus the dialog when there is nothing to focus in the content', () => {
			render(renderComponent(generateProps({ isVisible: true })))

			expect(document.activeElement).toBe(screen.getByRole('dialog'))
		})

		test('should focus the first focusable element of the content', () => {
			render(renderComponent(withButtons(generateProps({ isVisible: true }))))

			expect(document.activeElement).toBe(screen.getByText('First'))
		})

		test('should give the focus back when closing', () => {
			const opener = document.createElement('button')
			document.body.appendChild(opener)
			opener.focus()
			const props = generateProps({ isVisible: true })
			const { unmount } = render(renderComponent(props))

			expect(document.activeElement).not.toBe(opener)

			unmount()

			expect(document.activeElement).toBe(opener)
			opener.remove()
		})

		test('should close with the close button only once', () => {
			const props = generateProps({ isVisible: true })

			render(renderComponent(props))

			fireEvent.click(screen.getByLabelText('Close Testing dialog'))

			expect(props.onClose).toHaveBeenCalledTimes(1)
		})

		test('should keep the focus inside when tabbing forward from the last element', () => {
			render(renderComponent(withButtons(generateProps({ isVisible: true }))))
			screen.getByLabelText('Close Testing dialog').focus()

			const notPrevented = fireEvent.keyDown(screen.getByRole('dialog'), {
				key: 'Tab',
			})

			expect(notPrevented).toBe(false)
			expect(document.activeElement).toBe(screen.getByText('First'))
		})

		test('should keep the focus inside when tabbing backward from the first element', () => {
			render(renderComponent(withButtons(generateProps({ isVisible: true }))))

			const notPrevented = fireEvent.keyDown(screen.getByRole('dialog'), {
				key: 'Tab',
				shiftKey: true,
			})

			expect(notPrevented).toBe(false)
			expect(document.activeElement).toBe(
				screen.getByLabelText('Close Testing dialog'),
			)
		})

		test('should keep the focus inside when tabbing backward from the dialog', () => {
			render(renderComponent(generateProps({ isVisible: true })))

			const notPrevented = fireEvent.keyDown(screen.getByRole('dialog'), {
				key: 'Tab',
				shiftKey: true,
			})

			expect(notPrevented).toBe(false)
			expect(document.activeElement).toBe(
				screen.getByLabelText('Close Testing dialog'),
			)
		})

		test('should let the focus move naturally between the inner elements', () => {
			render(renderComponent(withButtons(generateProps({ isVisible: true }))))
			screen.getByText('Second').focus()

			expect(
				fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' }),
			).toBe(true)
			expect(
				fireEvent.keyDown(screen.getByRole('dialog'), {
					key: 'Tab',
					shiftKey: true,
				}),
			).toBe(true)
		})

		test('should ignore other keys', () => {
			render(renderComponent(withButtons(generateProps({ isVisible: true }))))

			expect(fireEvent.keyDown(screen.getByRole('dialog'), { key: 'a' })).toBe(
				true,
			)
		})
	})

	test('should be hidden by default', () => {
		render(
			<ThemeProvider theme={DarkTheme}>
				<Dialog title="Hidden" onClose={vi.fn()}>
					<div>Testing</div>
				</Dialog>
			</ThemeProvider>,
		)

		expect(screen.queryByRole('dialog')).toBeNull()
	})
})
