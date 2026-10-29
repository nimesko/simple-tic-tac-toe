import { Player, PlayerRank } from '@models/game'
import { generatePlayerId, getNextPlayer, sortRank } from '@services/game'
import Sound from '@services/sound'
import LocalStorage, { LocalStorageKey } from '@services/local-storage'
import { Dispatch, useReducer } from 'react'

enum GameReducerActionType {
	UPDATE_BOARD,
	RESET_BOARD,
	CREATE_PLAYER,
	UPDATE_PLAYER,
	WINNER_PLAYER,
	TIED_GAME,
	CHANGE_LEADER_BOARD_VISIBILITY,
	CHANGE_SOUND,
	UPDATE_PLAYER_FORM_VISIBILITY,
}

type GameReducerAction =
	| GameUpdateBoardAction
	| GameResetBoardAction
	| GameCreatePlayerAction
	| GameUpdatePlayerAction
	| GameWinnerPlayerAction
	| GameTiedAction
	| GameChangeLeaderBoardVisibilityAction
	| GameChangeSoundAction
	| GameUpdatePlayerFormVisibilityAction

interface GameUpdateBoardAction {
	type: GameReducerActionType.UPDATE_BOARD
	payload: GameUpdateBoardActionPayload
}

interface GameResetBoardAction {
	type: GameReducerActionType.RESET_BOARD
}

interface GameTiedAction {
	type: GameReducerActionType.TIED_GAME
}

interface GameCreatePlayerAction {
	type: GameReducerActionType.CREATE_PLAYER
	payload: GameCreatePlayerActionPayload
}

interface GameUpdatePlayerAction {
	type: GameReducerActionType.UPDATE_PLAYER
	payload: GameUpdatePlayerActionPayload
}

interface GameWinnerPlayerAction {
	type: GameReducerActionType.WINNER_PLAYER
	payload: GameWinnerPlayerActionPayload
}

interface GameChangeLeaderBoardVisibilityAction {
	type: GameReducerActionType.CHANGE_LEADER_BOARD_VISIBILITY
	payload: GameChangeLeaderBoardVisibilityActionPayload
}

interface GameChangeSoundAction {
	type: GameReducerActionType.CHANGE_SOUND
	payload: GameChangeSoundActionPayload
}

interface GameUpdatePlayerFormVisibilityAction {
	type: GameReducerActionType.UPDATE_PLAYER_FORM_VISIBILITY
	payload: GameUpdatePlayerFormVisibilityActionPayload
}

interface GameUpdateBoardActionPayload {
	position: number
}

interface GameCreatePlayerActionPayload {
	oldPlayer: Player
	newPlayer: Player
}

interface GameUpdatePlayerActionPayload {
	player: Player
}

interface GameWinnerPlayerActionPayload {
	player: Player
}

interface GameChangeLeaderBoardVisibilityActionPayload {
	visible: boolean
}

interface GameChangeSoundActionPayload {
	enable: boolean
}

interface GameUpdatePlayerFormVisibilityActionPayload {
	playerToUpdate?: Player
}

interface GameState {
	rank: PlayerRank[]
	players: Player[]
	grid: number[]
	currentPlayer: number
	isLeaderBoardVisible: boolean
	isSoundEnable: boolean
	playerToUpdate?: Player
}

const INITIAL_STATE: GameState = {
	grid: new Array(9).fill(-1),
	rank: [],
	players: [
		{
			id: generatePlayerId(),
			name: 'Player 1',
			score: 0,
		},
		{
			id: generatePlayerId(),
			name: 'Player 2',
			score: 0,
		},
	],
	currentPlayer: 0,
	isLeaderBoardVisible: false,
	isSoundEnable: true,
}

const resetBoard = (previousState: GameState): GameState => {
	return {
		...previousState,
		isLeaderBoardVisible: false,
		grid: previousState.grid.map(() => -1),
		currentPlayer: getNextPlayer(previousState.currentPlayer),
	}
}

const updateBoard = (
	previousState: GameState,
	payload: GameUpdateBoardActionPayload,
): GameState => {
	let hasNewMovement = false
	const grid = previousState.grid.map((value, index) => {
		if (index === payload.position && value === -1) {
			hasNewMovement = true
			if (previousState.isSoundEnable) {
				Sound.playMove()
			}
			return previousState.currentPlayer
		}
		return value
	})
	const currentPlayer = hasNewMovement
		? getNextPlayer(previousState.currentPlayer)
		: previousState.currentPlayer

	return {
		...previousState,
		isLeaderBoardVisible: false,
		currentPlayer,
		grid,
	}
}

const winnerPlayer = (
	previousState: GameState,
	payload: GameWinnerPlayerActionPayload,
): GameState => {
	const players = previousState.players.map((p) => {
		if (p.id === payload.player.id) {
			return {
				...p,
				score: p.score + 1,
			}
		}
		return {
			...p,
		}
	})

	if (previousState.isSoundEnable) {
		Sound.playWin()
	}

	const isLeaderBoardVisible = false
	const currentPlayer = getNextPlayer(previousState.currentPlayer)

	if (previousState.rank.find((p) => p.id === payload.player.id)) {
		const rank = sortRank(
			previousState.rank.map((p) => {
				if (p.id === payload.player.id) {
					return {
						...p,
						score: p.score + 1,
					}
				}
				return {
					...p,
				}
			}),
		)
		LocalStorage.store(LocalStorageKey.Rank, rank)
		return {
			...previousState,
			players,
			isLeaderBoardVisible,
			currentPlayer,
			rank,
		}
	} else {
		const rank = sortRank([
			...previousState.rank,
			{
				...payload.player,
				score: 1,
			},
		])
		LocalStorage.store(LocalStorageKey.Rank, rank)
		return {
			...previousState,
			players,
			isLeaderBoardVisible,
			currentPlayer,
			rank,
		}
	}
}

const tiedGame = (previousState: GameState): GameState => {
	if (previousState.isSoundEnable) {
		Sound.playTie()
	}
	return {
		...previousState,
		isLeaderBoardVisible: false,
		currentPlayer: getNextPlayer(previousState.currentPlayer),
	}
}

const updatePlayer = (
	previousState: GameState,
	payload: GameUpdatePlayerActionPayload,
): GameState => {
	return {
		...previousState,
		isLeaderBoardVisible: false,
		rank: previousState.rank.map((p) => {
			if (p.id === payload.player.id) {
				return {
					...p,
					name: payload.player.name,
				}
			}
			return {
				...p,
			}
		}),
		players: previousState.players.map((p) => {
			if (p.id === payload.player.id) {
				return {
					...p,
					name: payload.player.name,
				}
			}
			return {
				...p,
			}
		}),
		playerToUpdate: undefined,
	}
}

const createPlayer = (
	previousState: GameState,
	payload: GameCreatePlayerActionPayload,
): GameState => {
	const players = previousState.players.filter(
		(p) => p.id !== payload.oldPlayer.id,
	)
	players.push({
		...payload.newPlayer,
		id: generatePlayerId(),
		score: 0,
	})
	return {
		...previousState,
		isLeaderBoardVisible: false,
		players,
	}
}

function changeLeaderBoardVisibility(
	previousState: GameState,
	payload: GameChangeLeaderBoardVisibilityActionPayload,
): GameState {
	return {
		...previousState,
		isLeaderBoardVisible: payload.visible,
	}
}

function changeSound(
	previousState: GameState,
	payload: GameChangeSoundActionPayload,
): GameState {
	LocalStorage.store(LocalStorageKey.Sound, payload.enable)
	return {
		...previousState,
		isSoundEnable: payload.enable,
	}
}

function changeUpdatePlayerFormVisibility(
	previousState: GameState,
	payload: GameUpdatePlayerFormVisibilityActionPayload,
): GameState {
	return {
		...previousState,
		playerToUpdate: payload.playerToUpdate,
	}
}

const gameReducer = (
	previousState: GameState,
	action: GameReducerAction,
): GameState => {
	switch (action.type) {
		case GameReducerActionType.UPDATE_BOARD:
			return updateBoard(previousState, action.payload)
		case GameReducerActionType.RESET_BOARD:
			return resetBoard(previousState)
		case GameReducerActionType.CREATE_PLAYER:
			return createPlayer(previousState, action.payload)
		case GameReducerActionType.UPDATE_PLAYER:
			return updatePlayer(previousState, action.payload)
		case GameReducerActionType.WINNER_PLAYER:
			return winnerPlayer(previousState, action.payload)
		case GameReducerActionType.TIED_GAME:
			return tiedGame(previousState)
		case GameReducerActionType.CHANGE_LEADER_BOARD_VISIBILITY:
			return changeLeaderBoardVisibility(previousState, action.payload)
		case GameReducerActionType.CHANGE_SOUND:
			return changeSound(previousState, action.payload)
		case GameReducerActionType.UPDATE_PLAYER_FORM_VISIBILITY:
			return changeUpdatePlayerFormVisibility(previousState, action.payload)
	}
}

function loadState(): GameState {
	const isSoundEnableStored = LocalStorage.get(
		LocalStorageKey.Sound,
		true,
	) as unknown
	const rankStored = LocalStorage.get(LocalStorageKey.Rank, true) as unknown

	let isSoundEnable = false
	let rank: PlayerRank[] = []

	if (
		isSoundEnableStored === 'true' ||
		isSoundEnableStored === true ||
		isSoundEnableStored === 1 ||
		isSoundEnableStored === '1'
	) {
		isSoundEnable = true
	}

	if (
		typeof rankStored === 'object' &&
		rankStored instanceof Array &&
		rankStored.length > 0
	) {
		const isValid = rankStored
			.map((player) => {
				const validID =
					Object.prototype.hasOwnProperty.call(player, 'id') &&
					typeof player.id === 'string' &&
					player.id.length > 0

				const validName =
					Object.prototype.hasOwnProperty.call(player, 'name') &&
					typeof player.name === 'string' &&
					player.name.length > 0

				const validScore =
					Object.prototype.hasOwnProperty.call(player, 'score') &&
					typeof player.score === 'number'

				const validRank =
					Object.prototype.hasOwnProperty.call(player, 'rank') &&
					typeof player.rank === 'number'

				return validID && validName && validScore && validRank
			})
			.reduce((a, b) => a && b, true)

		if (isValid) {
			rank = rankStored
		}
	}

	return {
		...INITIAL_STATE,
		rank,
		isSoundEnable,
	}
}

export function useGameReducer() {
	return useReducer(gameReducer, loadState())
}

export function dispatchUpdateBoard(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameUpdateBoardActionPayload,
): void {
	dispatcher({ type: GameReducerActionType.UPDATE_BOARD, payload })
}

export function dispatchResetBoard(
	dispatcher: Dispatch<GameReducerAction>,
): void {
	dispatcher({ type: GameReducerActionType.RESET_BOARD })
}

export function dispatchCreatePlayer(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameCreatePlayerActionPayload,
): void {
	dispatcher({ type: GameReducerActionType.CREATE_PLAYER, payload })
}

export function dispatchUpdatePlayer(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameUpdatePlayerActionPayload,
): void {
	dispatcher({ type: GameReducerActionType.UPDATE_PLAYER, payload })
}

export function dispatchWinnerPlayer(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameWinnerPlayerActionPayload,
): void {
	dispatcher({ type: GameReducerActionType.WINNER_PLAYER, payload })
}

export function dispatchTiedGame(
	dispatcher: Dispatch<GameReducerAction>,
): void {
	dispatcher({ type: GameReducerActionType.TIED_GAME })
}

export function dispatchChangeLeaderBoardVisibility(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameChangeLeaderBoardVisibilityActionPayload,
): void {
	dispatcher({
		type: GameReducerActionType.CHANGE_LEADER_BOARD_VISIBILITY,
		payload,
	})
}

export function dispatchChangeSound(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameChangeSoundActionPayload,
): void {
	dispatcher({ type: GameReducerActionType.CHANGE_SOUND, payload })
}

export function dispatchChangePlayerFormVisibility(
	dispatcher: Dispatch<GameReducerAction>,
	payload: GameUpdatePlayerFormVisibilityActionPayload,
): void {
	dispatcher({
		type: GameReducerActionType.UPDATE_PLAYER_FORM_VISIBILITY,
		payload,
	})
}
