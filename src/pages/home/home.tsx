import React from 'react'
import styled from 'styled-components'
import Board from '@components/board/board'
import Score from '@components/score/score'
import { GameStatistics, Player } from '@models/game'
import {
	dispatchChangeLeaderBoardVisibility,
	dispatchChangePlayerFormVisibility,
	dispatchChangeSound,
	dispatchResetBoard,
	dispatchTiedGame,
	dispatchUpdateBoard,
	dispatchUpdatePlayer,
	dispatchWinnerPlayer,
	useGameReducer,
} from '@reducers/game'
import RankIcon from '@components/rank-icon/rank-icon'
import Button from '@components/button/button'
import Dialog from '@components/dialog/dialog'
import LeaderBoard from '@components/leader-board/leader-board'
import ToggleSound from '@components/toggle-sound/toggle-sound'
import { MediaQueries } from '@theme/theme'
import FormPlayer from '@components/form-player/form-player'
import GameStatus from '@components/game-status/game-status'
import { getGameStatistics } from '@services/game'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
`

const ScoreWrapper = styled.div`
	margin: 0 1rem;
`

const BoardWrapper = styled.div`
	width: 80vmin;
	max-width: 600px;
	margin: 3rem 0 0;
	@media screen and ${MediaQueries.sm} {
		width: 100vmin;
	}
`

const Title = styled.h1`
	font-size: 3rem;
	margin: 0;
`

const ButtonLeaderBoard = styled(Button)`
	width: 4rem;
`

const HorizontalContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 3rem 0 0;
`

const HomePage = () => {
	const [game, dispatcherGame] = useGameReducer()

	const handleOnGameUpdate = ({ position }: { position: number }) => {
		dispatchUpdateBoard(dispatcherGame, { position })
	}

	const handleOnGameFinished = ({ winner }: GameStatistics) => {
		if (winner) {
			dispatchWinnerPlayer(dispatcherGame, { player: winner })
		} else {
			dispatchTiedGame(dispatcherGame)
		}
	}

	const handleOnGameReset = () => {
		dispatchResetBoard(dispatcherGame)
	}

	const handleShowPlayerUpdateForm = (player: Player) => {
		dispatchChangePlayerFormVisibility(dispatcherGame, {
			playerToUpdate: player,
		})
	}

	const handleHidePlayerUpdateForm = () => {
		dispatchChangePlayerFormVisibility(dispatcherGame, {
			playerToUpdate: undefined,
		})
	}

	const handleShowLeaderBoard = () => {
		dispatchChangeLeaderBoardVisibility(dispatcherGame, { visible: true })
	}

	const handleHideLeaderBoard = () => {
		dispatchChangeLeaderBoardVisibility(dispatcherGame, { visible: false })
	}

	const handleOnChangeSound = (enable: boolean) => {
		dispatchChangeSound(dispatcherGame, { enable })
	}

	const handleOnChangePlayer = ({ name }: { name: string }) => {
		dispatchUpdatePlayer(dispatcherGame, {
			player: { ...(game.playerToUpdate as Player), name },
		})
	}

	const isEditMode = !!game.playerToUpdate

	const { winner, playsLeft } = getGameStatistics(game.grid)
	const turn = `${game.players[game.currentPlayer].name}'s turn (${game.currentPlayer === 0 ? 'X' : 'O'})`
	const status =
		winner !== -1
			? `${game.players[winner].name} won!`
			: playsLeft === 0
				? 'Tied game'
				: turn

	return (
		<Wrapper as="main">
			<GameStatus message={status} />
			<Title>Tic Tac Toe</Title>
			<BoardWrapper>
				<Board
					disableKeyboard={isEditMode || game.isLeaderBoardVisible}
					grid={game.grid}
					players={game.players}
					onGameUpdate={handleOnGameUpdate}
					onGameReset={handleOnGameReset}
					onGameFinished={handleOnGameFinished}
				/>
			</BoardWrapper>
			<HorizontalContainer>
				<ButtonLeaderBoard
					aria-label="Show LeaderBoard"
					onClick={handleShowLeaderBoard}
				>
					<RankIcon />
				</ButtonLeaderBoard>
				<ScoreWrapper>
					<Score
						currentPlayer={game.currentPlayer}
						players={game.players}
						onClickChangeName={handleShowPlayerUpdateForm}
					/>
				</ScoreWrapper>
				<ToggleSound
					onChange={handleOnChangeSound}
					isSoundEnabled={game.isSoundEnable}
				/>
			</HorizontalContainer>
			<Dialog
				title="Leaderboard"
				onClose={handleHideLeaderBoard}
				isVisible={game.isLeaderBoardVisible}
			>
				<LeaderBoard players={game.rank} />
			</Dialog>
			<Dialog
				title="Change player name"
				onClose={handleHidePlayerUpdateForm}
				isVisible={isEditMode}
			>
				<FormPlayer
					value={game.playerToUpdate as Player}
					onSubmit={handleOnChangePlayer}
				/>
			</Dialog>
		</Wrapper>
	)
}

export default HomePage
