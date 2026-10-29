import { Player, PlayerRank } from '@models/game'

export function sortRank(players: Player[]): PlayerRank[] {
	const sorted = players.sort((a, b) => b.score - a.score)
	const array: PlayerRank[] = []

	let total = 0,
		rank = 1

	for (let i = 0; i < sorted.length; i++) {
		const current = sorted[i]
		if (i === 0) {
			array.push({
				...current,
				rank,
			})
			continue
		}
		const previous = sorted[i - 1]
		if (previous.score === current.score) {
			array.push({
				...current,
				rank,
			})
			total++
		} else {
			rank = rank + total + 1
			total = 0
			array.push({
				...current,
				rank,
			})
		}
	}

	return array
}

export function getNextPlayer(currentPlayer: number): number {
	return (currentPlayer + 1) % 2
}

export function getGameStatistics(board: number[]): {
	winner: number
	playsLeft: number
} {
	let winner = -1,
		playsLeft = 0,
		isTied = true

	const size = Math.sqrt(board.length)

	for (let i = 0; i < size; i++) {
		const horizontal = i * size

		const h1 = board[horizontal]
		const h2 = board[horizontal + 1]
		const h3 = board[horizontal + 2]

		const v1 = board[i]
		const v2 = board[i + size]
		const v3 = board[i + size * 2]

		if (h1 === -1) {
			playsLeft++
		}

		if (h2 === -1) {
			playsLeft++
		}

		if (h3 === -1) {
			playsLeft++
		}

		if (isTied && h1 !== -1 && h1 === h2 && h1 === h3) {
			winner = h1
			isTied = false
		}

		if (isTied && v1 !== -1 && v1 === v2 && v1 === v3) {
			winner = v1
			isTied = false
		}

		if (i === 0) {
			if (
				isTied &&
				board[i] !== -1 &&
				board[i] === board[size + 1] &&
				board[i] === board[(size + 1) * 2]
			) {
				winner = board[i]
				isTied = false
			}
		}

		if (i === 2) {
			if (
				isTied &&
				board[i] !== -1 &&
				board[i] === board[i * i] &&
				board[i] === board[i * size]
			) {
				winner = board[i]
				isTied = false
			}
		}
	}

	return { winner, playsLeft }
}

export function generatePlayerId(): string {
	return Math.random().toString(36).replace('.', '')
}
