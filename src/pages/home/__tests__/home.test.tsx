import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'
import LocalStorage, { LocalStorageKey } from '@services/local-storage'
import HomePage from '../home'

vi.mock('@services/sound', () => ({
	default: {
		playMove: vi.fn(),
		playWin: vi.fn(),
		playTie: vi.fn(),
	},
}))

// Keys follow the numeric keypad layout, so 7 is the first cell and 3 the last one
const KEYS_TO_WIN = ['7', '4', '8', '5', '9']
const KEYS_TO_TIE = ['7', '8', '9', '5', '4', '6', '2', '1', '3']

const play = (keys: string[]) =>
	keys.forEach((key) => fireEvent.keyPress(document.body, { key }))

const renderPage = () => {
	const result = render(
		<ThemeProvider theme={DarkTheme}>
			<HomePage />
		</ThemeProvider>,
	)
	// The board is the only block between the title and the score, its first child holds the cells
	const grid = result.container.querySelector('h1')?.nextElementSibling
		?.firstElementChild?.firstElementChild as HTMLElement
	const countSvgs = () => document.querySelectorAll('svg').length
	const initialSvgs = countSvgs()
	return {
		cells: Array.from(grid.children) as HTMLElement[],
		marks: () => countSvgs() - initialSvgs,
	}
}

describe('HomePage', () => {
	let modalRoot: HTMLDivElement

	beforeEach(() => {
		localStorage.clear()
		modalRoot = document.createElement('div')
		modalRoot.id = 'modal-root'
		document.body.appendChild(modalRoot)
	})

	afterEach(() => {
		modalRoot.remove()
	})

	test('should render the title, both players and an empty board', () => {
		const { cells, marks } = renderPage()

		expect(screen.getByText('Tic Tac Toe')).toBeTruthy()
		expect(screen.getByText('Player 1 (X)')).toBeTruthy()
		expect(screen.getByText('Player 2 (O)')).toBeTruthy()
		expect(cells).toHaveLength(9)
		expect(marks()).toBe(0)
	})

	test('should place a move when clicking a cell', () => {
		const { cells, marks } = renderPage()

		fireEvent.click(cells[4])

		expect(marks()).toBe(1)
		expect(cells[4].querySelector('svg')).not.toBeNull()
	})

	test('should place the moves played with the keyboard', () => {
		const { cells, marks } = renderPage()

		play(['7', '8'])

		expect(marks()).toBe(2)
		expect(cells[0].querySelector('svg')).not.toBeNull()
		expect(cells[1].querySelector('svg')).not.toBeNull()
	})

	test('should score the winner, then start a new game with Enter', () => {
		renderPage()

		play(KEYS_TO_WIN)

		expect(screen.getAllByText('Player 1 won!')).toHaveLength(2)
		expect(screen.getByText('1')).toBeTruthy()

		play(['Enter'])

		expect(screen.queryByText('Player 1 won!')).toBeNull()
	})

	test('should store the winner in the rank', () => {
		renderPage()

		play(KEYS_TO_WIN)

		expect(LocalStorage.get(LocalStorageKey.Rank)).toHaveLength(1)
	})

	test('should handle a tied game, then start a new game with the button', () => {
		renderPage()

		play(KEYS_TO_TIE)

		expect(screen.getByText('Tied Game')).toBeTruthy()

		fireEvent.click(screen.getByLabelText('Start New Game'))

		expect(screen.queryByText('Tied Game')).toBeNull()
	})

	test('should show the leader board, then close it with Escape', () => {
		renderPage()

		expect(modalRoot.querySelector('dialog')).toBeNull()

		fireEvent.click(screen.getByLabelText('Show LeaderBoard'))

		expect(modalRoot.querySelector('dialog')).not.toBeNull()
		expect(screen.getByText('Nobody scored yet')).toBeTruthy()

		fireEvent.keyUp(document, { key: 'Escape' })

		expect(modalRoot.querySelector('dialog')).toBeNull()
	})

	test('should list the winner in the leader board', () => {
		renderPage()

		play(KEYS_TO_WIN)
		fireEvent.click(screen.getByLabelText('Show LeaderBoard'))

		expect(modalRoot.textContent).toContain('Player 1')
		expect(modalRoot.textContent).not.toContain('Nobody scored yet')
	})

	test('should close the leader board when clicking the dialog', () => {
		renderPage()

		fireEvent.click(screen.getByLabelText('Show LeaderBoard'))
		fireEvent.click(modalRoot.querySelector('dialog') as HTMLElement)

		expect(modalRoot.querySelector('dialog')).toBeNull()
	})

	test('should toggle the sound', () => {
		renderPage()

		fireEvent.click(screen.getByLabelText('Toggle sound to off'))

		expect(screen.getByLabelText('Toggle sound to on')).toBeTruthy()
		expect(LocalStorage.get(LocalStorageKey.Sound)).toBe(false)

		fireEvent.click(screen.getByLabelText('Toggle sound to on'))

		expect(screen.getByLabelText('Toggle sound to off')).toBeTruthy()
	})

	test('should rename a player and disable the keyboard while editing', () => {
		const { marks } = renderPage()

		fireEvent.click(screen.getByText('Player 1 (X)'))
		play(['7'])

		expect(marks()).toBe(0)

		fireEvent.change(screen.getByLabelText('Name'), {
			target: { value: 'Alice' },
		})
		fireEvent.click(screen.getByText('Save'))

		expect(screen.getByText('Alice (X)')).toBeTruthy()
		expect(modalRoot.querySelector('dialog')).toBeNull()

		play(['7'])

		expect(marks()).toBe(1)
	})

	test('should close the player form with Escape', () => {
		renderPage()

		fireEvent.click(screen.getByText('Player 2 (O)'))

		expect(modalRoot.querySelector('form')).not.toBeNull()

		fireEvent.keyUp(document, { key: 'Escape' })

		expect(modalRoot.querySelector('form')).toBeNull()
		expect(screen.getByText('Player 2 (O)')).toBeTruthy()
	})

	describe('accessibility', () => {
		const status = () => screen.getByRole('status').textContent

		test('should have a main landmark with the title', () => {
			renderPage()

			const main = screen.getByRole('main')

			expect(main.querySelector('h1')?.textContent).toBe('Tic Tac Toe')
		})

		test('should announce whose turn it is', () => {
			renderPage()

			expect(status()).toBe("Player 1's turn (X)")

			play(['7'])

			expect(status()).toBe("Player 2's turn (O)")
		})

		test('should announce the winner', () => {
			renderPage()

			play(KEYS_TO_WIN)

			expect(status()).toBe('Player 1 won!')
		})

		test('should announce a tied game', () => {
			renderPage()

			play(KEYS_TO_TIE)

			expect(status()).toBe('Tied game')
		})

		test('should move the focus to the end game action, then back to the board', () => {
			const { cells } = renderPage()

			play(KEYS_TO_WIN)

			expect(document.activeElement).toBe(
				screen.getByLabelText('Start New Game'),
			)

			fireEvent.click(screen.getByLabelText('Start New Game'))

			expect(document.activeElement).toBe(cells[0])
		})

		test('should name the dialogs and take the focus into them', () => {
			renderPage()

			fireEvent.click(screen.getByLabelText('Show LeaderBoard'))

			expect(screen.getByRole('dialog', { name: 'Leaderboard' })).toBeTruthy()
			expect(document.activeElement).toBe(screen.getByRole('dialog'))

			fireEvent.click(screen.getByLabelText('Close Leaderboard'))

			fireEvent.click(screen.getByLabelText('Player 1 (X), change name'))

			expect(
				screen.getByRole('dialog', { name: 'Change player name' }),
			).toBeTruthy()
			expect(document.activeElement).toBe(screen.getByLabelText('Name'))
		})

		test('should give the focus back to the control that opened a dialog', () => {
			renderPage()
			const opener = screen.getByLabelText('Show LeaderBoard')
			opener.focus()

			fireEvent.click(opener)
			fireEvent.keyUp(document, { key: 'Escape' })

			expect(document.activeElement).toBe(opener)
		})

		test('should not play behind the leader board', () => {
			const { marks } = renderPage()

			fireEvent.click(screen.getByLabelText('Show LeaderBoard'))
			play(['7'])

			expect(marks()).toBe(0)
		})
	})
})
