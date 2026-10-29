import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DarkTheme, LightTheme } from '@theme/theme'
import HomePage from '../pages/home/home'
import { scan } from './helpers/axe'

vi.mock('@services/sound', () => ({
	default: { playMove: vi.fn(), playWin: vi.fn(), playTie: vi.fn() },
}))

const KEYS_TO_WIN = ['7', '4', '8', '5', '9']
const KEYS_TO_TIE = ['7', '8', '9', '5', '4', '6', '2', '1', '3']

const play = (keys: string[]) =>
	keys.forEach((key) => fireEvent.keyPress(document.body, { key }))

const expectNoViolations = async () => {
	const { results, report } = await scan()

	expect(results.violations, `\n${report}\n`).toHaveLength(0)
}

describe.each([
	['dark', DarkTheme],
	['light', LightTheme],
])('accessibility (%s theme)', (_, theme) => {
	let modalRoot: HTMLDivElement

	beforeEach(() => {
		localStorage.clear()
		modalRoot = document.createElement('div')
		modalRoot.id = 'modal-root'
		document.body.appendChild(modalRoot)
		render(
			<ThemeProvider theme={theme}>
				<HomePage />
			</ThemeProvider>,
		)
	})

	afterEach(() => {
		modalRoot.remove()
	})

	test('new game', async () => {
		await expectNoViolations()
	})

	test('game in progress', async () => {
		play(['7', '8'])

		await expectNoViolations()
	})

	test('winner', async () => {
		play(KEYS_TO_WIN)

		await expectNoViolations()
	})

	test('tied game', async () => {
		play(KEYS_TO_TIE)

		await expectNoViolations()
	})

	test('empty leader board', async () => {
		fireEvent.click(screen.getByLabelText('Show LeaderBoard'))

		await expectNoViolations()
	})

	test('leader board with players', async () => {
		play(KEYS_TO_WIN)
		fireEvent.click(screen.getByLabelText('Show LeaderBoard'))

		await expectNoViolations()
	})

	test('player form', async () => {
		fireEvent.click(screen.getByText('Player 1 (X)'))

		await expectNoViolations()
	})
})
