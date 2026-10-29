import React, { useEffect, useRef } from 'react'
import Field from '@components/field/field'
import BoardGrid from '@components/board-grid/board-grid'
import BoardEndGame from '@components/board-end-game/board-end-game'
import { getGameStatistics } from '@services/game'
import styled from 'styled-components'
import { GameStatistics, Player } from '@models/game'
import { processKeyNumber } from '@services/event'

export interface BoardProps {
	grid: number[]
	players: Player[]
	disableKeyboard: boolean
	onGameUpdate: ({ position }: { position: number }) => void
	onGameReset: () => void
	onGameFinished: ({ grid, winner }: GameStatistics) => void
}

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	&:after {
		content: '';
		display: block;
		padding-bottom: 100%;
	}
	${BoardGrid} {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
`

const WrapperBoardEndGame = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`

const Board = ({
	disableKeyboard,
	grid,
	players,
	onGameUpdate,
	onGameFinished,
	onGameReset,
}: BoardProps) => {
	const { winner, playsLeft } = getGameStatistics(grid)
	const isGameFinished = playsLeft === 0 || winner !== -1
	const size = Math.sqrt(grid.length)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const wasGameFinished = useRef(isGameFinished)

	const handleClick = ({ position }: { position: number }) => {
		onGameUpdate({ position })
	}

	const handleResetGame = () => {
		onGameReset()
	}

	useEffect(() => {
		const onKeyPress = (event: KeyboardEvent) => {
			if (disableKeyboard) {
				return
			}
			const number = +event.key.trim()
			if (isGameFinished) {
				// A focused button is already activated by Enter, so the shortcut would reset twice
				const isButton = (event.target as HTMLElement).tagName === 'BUTTON'
				if (/enter/i.test(event.key) && !isButton) {
					event.preventDefault()
					onGameReset()
				}
			} else if (number && !isNaN(number)) {
				event.preventDefault()
				onGameUpdate({ position: processKeyNumber(number) })
			}
		}
		document.addEventListener('keypress', onKeyPress)

		return () => document.removeEventListener('keypress', onKeyPress)
	}, [disableKeyboard, isGameFinished])

	// Without this the focus is lost when the end game overlay is removed
	useEffect(() => {
		if (wasGameFinished.current && !isGameFinished) {
			wrapperRef.current?.querySelector('button')?.focus()
		}
		wasGameFinished.current = isGameFinished
	}, [isGameFinished])

	useEffect(() => {
		if (isGameFinished) {
			onGameFinished({ grid, winner: players[winner] })
		}
	}, [isGameFinished])

	return (
		<Wrapper ref={wrapperRef} role="group" aria-label="Game board">
			<BoardGrid size={size} disabled={isGameFinished}>
				{grid.map((player, index) => (
					<Field
						onClick={handleClick}
						position={index}
						size={size}
						key={index}
						player={player}
						disabled={isGameFinished}
					/>
				))}
			</BoardGrid>
			{isGameFinished && (
				<WrapperBoardEndGame>
					<BoardEndGame
						player={players[winner]}
						onResetGame={handleResetGame}
					/>
				</WrapperBoardEndGame>
			)}
		</Wrapper>
	)
}

export default Board
