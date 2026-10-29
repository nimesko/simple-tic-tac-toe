import { faker } from '@faker-js/faker'
import { Player } from '@models/game'
import {
	sortRank,
	getNextPlayer,
	getGameStatistics,
	generatePlayerId,
} from '../game'

describe('game', () => {
	describe('sortRank', () => {
		test('should return an empty array', () => {
			expect(sortRank([])).toHaveLength(0)
		})

		test('should return with different ranks', () => {
			const totalPlayers = 2

			const players: Player[] = new Array(totalPlayers)
				.fill(0)
				.map((_, index) => ({
					id: `${Math.random()}`,
					name: faker.person.fullName(),
					score: index + 1,
				}))

			const result = sortRank(players)

			expect(result).toHaveLength(players.length)

			const map = new Map()

			result.forEach((player) => {
				if (map.has(player.rank)) {
					map.set(player.rank, map.get(player.rank) + 1)
				} else {
					map.set(player.rank, 1)
				}
			})

			const values = Array.from(map.values())

			values.forEach((count) => {
				expect(count).toBe(1)
			})

			expect(values).toHaveLength(totalPlayers)
		})

		test('should return with equal ranks', () => {
			const totalPlayers = 10

			const players: Player[] = new Array(totalPlayers).fill(0).map(() => ({
				id: `${Math.random()}`,
				name: faker.person.fullName(),
				score: 1,
			}))

			const result = sortRank(players)

			expect(result).toHaveLength(players.length)

			const map = new Map()

			result.forEach((player) => {
				if (map.has(player.rank)) {
					map.set(player.rank, map.get(player.rank) + 1)
				} else {
					map.set(player.rank, 1)
				}
			})

			const values = Array.from(map.values())

			values.forEach((count) => {
				expect(count).toBe(totalPlayers)
			})

			expect(values).not.toHaveLength(totalPlayers)
		})

		test('should return with equal ranks and rank jumps', () => {
			const totalPlayersWithEqualScores = 4
			const totalPlayersWithDifferentScore = 3
			const players = []

			players.push(
				...new Array(totalPlayersWithEqualScores).fill(0).map(() => ({
					id: `${Math.random()}`,
					name: faker.person.fullName(),
					score: 8,
				})),
			)

			players.push(
				...new Array(totalPlayersWithDifferentScore)
					.fill(0)
					.map((_, index) => ({
						id: `${Math.random()}`,
						name: faker.person.fullName(),
						score: index + 5,
					})),
			)

			players.push(
				...new Array(totalPlayersWithEqualScores).fill(0).map(() => ({
					id: `${Math.random()}`,
					name: faker.person.fullName(),
					score: 4,
				})),
			)

			players.push(
				...new Array(totalPlayersWithDifferentScore)
					.fill(0)
					.map((_, index) => ({
						id: `${Math.random()}`,
						name: faker.person.fullName(),
						score: index + 1,
					})),
			)

			const result = sortRank(players)

			expect(result).toHaveLength(
				totalPlayersWithDifferentScore * 2 + totalPlayersWithEqualScores * 2,
			)

			const map = new Map()

			result.forEach((player) => {
				if (map.has(player.rank)) {
					map.set(player.rank, map.get(player.rank) + 1)
				} else {
					map.set(player.rank, 1)
				}
			})

			expect(map.get(1)).toBe(totalPlayersWithEqualScores)
			expect(map.get(5)).toBe(1)
			expect(map.get(6)).toBe(1)
			expect(map.get(7)).toBe(1)
			expect(map.get(8)).toBe(totalPlayersWithEqualScores)
			expect(map.get(12)).toBe(1)
			expect(map.get(13)).toBe(1)
			expect(map.get(14)).toBe(1)
		})
	})

	describe('getNextPlayer', () => {
		test('should get the next player', () => {
			const currentPlayer = 0

			const nextPlayer = getNextPlayer(currentPlayer)

			expect(currentPlayer).not.toBe(nextPlayer)
		})
	})

	describe('getGameStatistics', () => {
		test('should as the first player as winner with players left on horizontal', () => {
			;[
				[0, 0, 0, -1, 1, -1, 1, 1, -1],
				[-1, 1, -1, 0, 0, 0, 1, 1, -1],
				[-1, 1, -1, 1, 1, -1, 0, 0, 0],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(0)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})

		test('should as the second player as winner with plays left on horizontal', () => {
			;[
				[1, 1, 1, -1, 0, -1, 0, 0, -1],
				[-1, 0, -1, 1, 1, 1, 0, 0, -1],
				[-1, 0, -1, 0, 0, -1, 1, 1, 1],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(1)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})

		test('should as the first player as winner with players left on vertical', () => {
			;[
				[0, 1, -1, 0, -1, 1, 0, 1, -1],
				[1, 0, -1, -1, 0, 1, 1, 0, -1],
				[1, -1, 0, -1, 1, 0, 1, -1, 0],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(0)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})

		test('should as the second player as winner with plays left on vertical', () => {
			;[
				[1, 1, -1, 1, -1, 1, 1, 1, -1],
				[1, 1, -1, -1, 1, 1, 1, 1, -1],
				[1, -1, 1, -1, 1, 1, 1, -1, 1],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(1)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})

		test('should as the first player as winner with plays left on diagonal', () => {
			;[
				[0, -1, 1, 1, 0, -1, -1, 1, 0],
				[1, -1, 0, 1, 0, -1, 0, -1, 1],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(0)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})

		test('should as the second player as winner with plays left on diagonal', () => {
			;[
				[1, -1, 0, 0, 1, -1, -1, 0, 1],
				[0, -1, 1, 0, 1, -1, 1, -1, 0],
			].forEach((board) => {
				const { winner, playsLeft } = getGameStatistics(board)

				expect(winner).toBe(1)
				expect(playsLeft).toBeGreaterThan(0)
			})
		})
	})

	describe('generatePlayerId', () => {
		test('should generate random ID', () => {
			expect(generatePlayerId()).toBeTruthy()
		})
	})
})
