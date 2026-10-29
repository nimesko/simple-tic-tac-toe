import React from 'react'
import { render, screen } from '@testing-library/react'
import LeaderBoard, { LeaderBoardProps } from '../leader-board'
import { faker } from '@faker-js/faker'
import { ThemeProvider } from 'styled-components'
import { DarkTheme } from '@theme/theme'

const generateProps = ({
	playersLength,
}: {
	playersLength: number
}): Required<LeaderBoardProps> => {
	return {
		players: new Array(playersLength).fill(0).map((_, index) => ({
			id: `${index + 1}`,
			name: faker.person.fullName(),
			score: index + 100,
			rank: index + 1,
		})),
	}
}

const renderComponent = (props: LeaderBoardProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<LeaderBoard {...props} />
		</ThemeProvider>
	)
}

describe('LeaderBoard', () => {
	test('should render', () => {
		const props = generateProps({ playersLength: 10 })

		render(renderComponent(props))

		props.players?.forEach((player, index) => {
			expect(screen.getByText(new RegExp(`^${index + 1}$`))).toBeTruthy()
			expect(screen.getByText(new RegExp(`^${player.score}$`))).toBeTruthy()
			expect(screen.getByText(new RegExp(player.name))).toBeTruthy()
		})
	})

	test('should render empty scores', () => {
		const props = generateProps({ playersLength: 0 })

		render(renderComponent(props))

		expect(screen.getByText('Nobody scored yet')).toBeTruthy()
	})

	test('should name the table', () => {
		render(
			<ThemeProvider theme={DarkTheme}>
				<LeaderBoard {...generateProps({ playersLength: 2 })} />
			</ThemeProvider>,
		)

		expect(screen.getByRole('table', { name: 'Leaderboard' })).toBeTruthy()
	})
})
