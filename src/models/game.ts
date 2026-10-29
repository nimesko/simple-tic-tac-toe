export interface Player {
	id: string
	name: string
	score: number
}

export interface PlayerRank extends Player {
	rank: number
}

export interface FormPlayer {
	firstPlayer: string
	secondPlayer: string
}

export interface GameStatistics {
	grid: number[]
	winner?: Player
}
