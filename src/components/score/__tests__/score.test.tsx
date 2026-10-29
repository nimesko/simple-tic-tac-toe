import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { faker } from '@faker-js/faker'

import Score, { ScoreProps } from '../score'
import { DarkTheme } from '@theme/theme'
import { ThemeProvider } from 'styled-components'

const generateProps = ({
	currentPlayer,
	playersLength,
}: {
	currentPlayer: number
	playersLength: number
}): Required<ScoreProps> => {
	return {
		currentPlayer,
		players: new Array(playersLength).fill(0).map((_, index) => ({
			id: `${index + 1}`,
			name: faker.internet.username(),
			// Scores are distinct (and the names never are numbers) so the texts can be told apart
			score: index * 50 + faker.number.int(49),
		})),
		onClickChangeName: vi.fn(),
	}
}

const renderComponent = (props: ScoreProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Score {...props} />
		</ThemeProvider>
	)
}

describe('Score', () => {
	test('should render as player 1', () => {
		const props: Required<ScoreProps> = generateProps({
			currentPlayer: 0,
			playersLength: 2,
		})

		render(renderComponent(props))

		props.players.forEach((player) => {
			expect(screen.getByText(new RegExp(player.name, 'i'))).toBeTruthy()
			expect(screen.getByText(player.score)).toBeTruthy()
		})
	})

	test('should render as player 2', () => {
		const props: Required<ScoreProps> = generateProps({
			currentPlayer: 1,
			playersLength: 2,
		})

		render(renderComponent(props))

		props.players.forEach((player) => {
			expect(screen.getByText(new RegExp(player.name, 'i'))).toBeTruthy()
			expect(screen.getByText(player.score)).toBeTruthy()
		})
	})

	test('should render abbreviation for score', () => {
		const props: Required<ScoreProps> = generateProps({
			currentPlayer: 0,
			playersLength: 2,
		})

		props.players.forEach((player) => {
			player.score += 100
		})

		render(renderComponent(props))

		expect(screen.getAllByText('+99')).toHaveLength(2)
	})

	test('should raise an error when having more or less than 2 players', () => {
		;[
			generateProps({ currentPlayer: 1, playersLength: 3 }),
			generateProps({ currentPlayer: 0, playersLength: 1 }),
			generateProps({ currentPlayer: 1, playersLength: 100 }),
		].forEach((props: ScoreProps) =>
			expect(() => render(renderComponent(props))).toThrow(),
		)
	})

	test('should call onChangeName', () => {
		const props: Required<ScoreProps> = generateProps({
			currentPlayer: 0,
			playersLength: 2,
		})

		render(renderComponent(props))

		props.players.forEach((player) => {
			fireEvent.click(screen.getByText(new RegExp(player.name, 'i')))
		})

		expect(props.onClickChangeName).toHaveBeenCalledTimes(props.players.length)
	})

	describe('accessibility', () => {
		test('should group the score', () => {
			render(
				renderComponent(generateProps({ currentPlayer: 0, playersLength: 2 })),
			)

			expect(screen.getByRole('group', { name: 'Score' })).toBeTruthy()
		})

		test('should let the players change their names with the keyboard', () => {
			const props = generateProps({ currentPlayer: 0, playersLength: 2 })
			render(renderComponent(props))

			const buttons = screen.getAllByRole('button')

			expect(buttons).toHaveLength(2)
			expect(buttons[0].getAttribute('aria-label')).toBe(
				`${props.players[0].name} (X), change name`,
			)
			expect(buttons[1].getAttribute('aria-label')).toBe(
				`${props.players[1].name} (O), change name`,
			)

			fireEvent.click(buttons[1])

			expect(props.onClickChangeName).toHaveBeenCalledWith(props.players[1])
		})

		test.each([
			[0, 0],
			[1, 1],
		])('should mark player %i as the current one', (currentPlayer, index) => {
			render(
				renderComponent(generateProps({ currentPlayer, playersLength: 2 })),
			)

			const buttons = screen.getAllByRole('button')

			expect(buttons[index].getAttribute('aria-current')).toBe('true')
			expect(buttons[1 - index].hasAttribute('aria-current')).toBe(false)
		})

		test('should hide the decorative turn indicator', () => {
			const { container } = render(
				renderComponent(generateProps({ currentPlayer: 0, playersLength: 2 })),
			)

			expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1)
		})
	})
})
