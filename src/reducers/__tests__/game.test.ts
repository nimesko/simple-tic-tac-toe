import { act, renderHook } from '@testing-library/react'
import LocalStorage, { LocalStorageKey } from '@services/local-storage'
import Sound from '@services/sound'
import {
	dispatchChangeLeaderBoardVisibility,
	dispatchChangePlayerFormVisibility,
	dispatchChangeSound,
	dispatchCreatePlayer,
	dispatchResetBoard,
	dispatchTiedGame,
	dispatchUpdateBoard,
	dispatchUpdatePlayer,
	dispatchWinnerPlayer,
	useGameReducer,
} from '../game'

vi.mock('@services/sound', () => ({
	default: {
		playMove: vi.fn(),
		playWin: vi.fn(),
		playTie: vi.fn(),
	},
}))

const validRank = { id: 'a', name: 'Alice', score: 3, rank: 1 }

const setup = () => {
	const { result } = renderHook(() => useGameReducer())
	return {
		state: () => result.current[0],
		dispatch: (action: (dispatcher: (typeof result.current)[1]) => void) => {
			act(() => action(result.current[1]))
		},
	}
}

describe('game reducer', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	describe('initial state', () => {
		test('should start with an empty board and two players', () => {
			const { state } = setup()

			expect(state().grid).toStrictEqual(new Array(9).fill(-1))
			expect(state().players).toHaveLength(2)
			expect(state().players.map((p) => p.name)).toStrictEqual([
				'Player 1',
				'Player 2',
			])
			expect(state().players.every((p) => p.score === 0)).toBe(true)
			expect(state().players[0].id).not.toBe(state().players[1].id)
			expect(state().currentPlayer).toBe(0)
			expect(state().rank).toStrictEqual([])
			expect(state().isLeaderBoardVisible).toBe(false)
			expect(state().playerToUpdate).toBeUndefined()
		})

		test.each([
			[true, true],
			['true', true],
			[1, true],
			['1', true],
			[false, false],
			['false', false],
			[0, false],
			['yes', false],
		])('should load the stored sound %j as %s', (stored, expected) => {
			LocalStorage.store(LocalStorageKey.Sound, stored)

			const { state } = setup()

			expect(state().isSoundEnable).toBe(expected)
		})

		test('should enable the sound when nothing is stored', () => {
			const { state } = setup()

			expect(state().isSoundEnable).toBe(true)
		})

		test('should load a valid stored rank', () => {
			LocalStorage.store(LocalStorageKey.Rank, [validRank])

			const { state } = setup()

			expect(state().rank).toStrictEqual([validRank])
		})

		test.each([
			['an empty list', []],
			['an object', { ...validRank }],
			['a string', 'rank'],
			['a player without id', [{ ...validRank, id: undefined }]],
			['a player with an empty id', [{ ...validRank, id: '' }]],
			['a player with a numeric id', [{ ...validRank, id: 1 }]],
			['a player without name', [{ ...validRank, name: undefined }]],
			['a player with an empty name', [{ ...validRank, name: '' }]],
			['a player with a numeric name', [{ ...validRank, name: 1 }]],
			['a player without score', [{ ...validRank, score: undefined }]],
			['a player with a string score', [{ ...validRank, score: '3' }]],
			['a player without rank', [{ ...validRank, rank: undefined }]],
			['a player with a string rank', [{ ...validRank, rank: '1' }]],
			[
				'a valid player followed by an invalid one',
				[validRank, { ...validRank, id: '' }],
			],
		])('should ignore a stored rank with %s', (_, stored) => {
			LocalStorage.store(LocalStorageKey.Rank, stored)

			const { state } = setup()

			expect(state().rank).toStrictEqual([])
		})
	})

	describe('update board', () => {
		test('should place the move of the current player and pass the turn', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchUpdateBoard(d, { position: 4 }))

			expect(state().grid[4]).toBe(0)
			expect(state().currentPlayer).toBe(1)
			expect(Sound.playMove).toHaveBeenCalledTimes(1)
		})

		test('should ignore a move on a taken position', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchUpdateBoard(d, { position: 4 }))
			dispatch((d) => dispatchUpdateBoard(d, { position: 4 }))

			expect(state().grid[4]).toBe(0)
			expect(state().currentPlayer).toBe(1)
			expect(Sound.playMove).toHaveBeenCalledTimes(1)
		})

		test('should not play the sound when it is disabled', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchChangeSound(d, { enable: false }))
			dispatch((d) => dispatchUpdateBoard(d, { position: 0 }))

			expect(state().grid[0]).toBe(0)
			expect(Sound.playMove).not.toHaveBeenCalled()
		})

		test('should hide the leader board', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchChangeLeaderBoardVisibility(d, { visible: true }))
			dispatch((d) => dispatchUpdateBoard(d, { position: 0 }))

			expect(state().isLeaderBoardVisible).toBe(false)
		})
	})

	describe('reset board', () => {
		test('should clear the grid and pass the turn', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchUpdateBoard(d, { position: 0 }))
			dispatch((d) => dispatchChangeLeaderBoardVisibility(d, { visible: true }))
			dispatch((d) => dispatchResetBoard(d))

			expect(state().grid).toStrictEqual(new Array(9).fill(-1))
			expect(state().currentPlayer).toBe(0)
			expect(state().isLeaderBoardVisible).toBe(false)
		})
	})

	describe('winner player', () => {
		test('should score the winner and add them to the rank', () => {
			const { state, dispatch } = setup()
			const winner = state().players[0]

			dispatch((d) => dispatchWinnerPlayer(d, { player: winner }))

			expect(state().players[0].score).toBe(1)
			expect(state().players[1].score).toBe(0)
			expect(state().rank).toStrictEqual([{ ...winner, score: 1, rank: 1 }])
			expect(state().currentPlayer).toBe(1)
			expect(LocalStorage.get(LocalStorageKey.Rank)).toStrictEqual(state().rank)
			expect(Sound.playWin).toHaveBeenCalledTimes(1)
		})

		test('should increase the score of a player already in the rank', () => {
			const { state, dispatch } = setup()
			const [first, second] = state().players

			dispatch((d) => dispatchWinnerPlayer(d, { player: first }))
			dispatch((d) => dispatchWinnerPlayer(d, { player: second }))
			dispatch((d) => dispatchWinnerPlayer(d, { player: first }))

			expect(state().players.map((p) => p.score)).toStrictEqual([2, 1])
			expect(state().rank.map((p) => [p.id, p.score, p.rank])).toStrictEqual([
				[first.id, 2, 1],
				[second.id, 1, 2],
			])
			expect(LocalStorage.get(LocalStorageKey.Rank)).toStrictEqual(state().rank)
		})

		test('should not play the sound when it is disabled', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchChangeSound(d, { enable: false }))
			dispatch((d) => dispatchWinnerPlayer(d, { player: state().players[0] }))

			expect(Sound.playWin).not.toHaveBeenCalled()
		})
	})

	describe('tied game', () => {
		test('should pass the turn and play the tie sound', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchTiedGame(d))

			expect(state().currentPlayer).toBe(1)
			expect(Sound.playTie).toHaveBeenCalledTimes(1)
		})

		test('should not play the sound when it is disabled', () => {
			const { dispatch } = setup()

			dispatch((d) => dispatchChangeSound(d, { enable: false }))
			dispatch((d) => dispatchTiedGame(d))

			expect(Sound.playTie).not.toHaveBeenCalled()
		})
	})

	describe('players', () => {
		test('should rename a player in the game and in the rank', () => {
			const { state, dispatch } = setup()
			const [first, second] = state().players

			dispatch((d) => dispatchWinnerPlayer(d, { player: first }))
			dispatch((d) => dispatchWinnerPlayer(d, { player: second }))
			dispatch((d) =>
				dispatchChangePlayerFormVisibility(d, { playerToUpdate: first }),
			)
			dispatch((d) =>
				dispatchUpdatePlayer(d, { player: { ...first, name: 'Alice' } }),
			)

			expect(state().players.map((p) => p.name)).toStrictEqual([
				'Alice',
				'Player 2',
			])
			expect(state().rank.map((p) => p.name)).toStrictEqual([
				'Alice',
				'Player 2',
			])
			expect(state().playerToUpdate).toBeUndefined()
		})

		test('should replace a player with a new one', () => {
			const { state, dispatch } = setup()
			const [first, second] = state().players

			dispatch((d) =>
				dispatchCreatePlayer(d, {
					oldPlayer: first,
					newPlayer: { id: 'x', name: 'Bob', score: 10 },
				}),
			)

			expect(state().players).toHaveLength(2)
			expect(state().players[0]).toStrictEqual(second)
			expect(state().players[1].name).toBe('Bob')
			expect(state().players[1].score).toBe(0)
			expect(state().players[1].id).not.toBe('x')
			expect(state().players[1].id).not.toBe(first.id)
		})

		test('should show and hide the player form', () => {
			const { state, dispatch } = setup()
			const player = state().players[0]

			dispatch((d) =>
				dispatchChangePlayerFormVisibility(d, { playerToUpdate: player }),
			)
			expect(state().playerToUpdate).toStrictEqual(player)

			dispatch((d) =>
				dispatchChangePlayerFormVisibility(d, { playerToUpdate: undefined }),
			)
			expect(state().playerToUpdate).toBeUndefined()
		})
	})

	describe('settings', () => {
		test('should show and hide the leader board', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchChangeLeaderBoardVisibility(d, { visible: true }))
			expect(state().isLeaderBoardVisible).toBe(true)

			dispatch((d) =>
				dispatchChangeLeaderBoardVisibility(d, { visible: false }),
			)
			expect(state().isLeaderBoardVisible).toBe(false)
		})

		test('should change and store the sound', () => {
			const { state, dispatch } = setup()

			dispatch((d) => dispatchChangeSound(d, { enable: false }))

			expect(state().isSoundEnable).toBe(false)
			expect(LocalStorage.get(LocalStorageKey.Sound)).toBe(false)
		})
	})
})
