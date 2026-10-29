import { Player } from '@models/game'
import React from 'react'
import styled from 'styled-components'
import { MediaQueries } from '@theme/theme'

export interface ScoreProps {
	currentPlayer: number
	players: Player[]
	onClickChangeName: (player: Player) => void
}

const Wrapper = styled.div`
	width: 100px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1px solid ${(props) => props.theme.color.borderColorGrid};
	color: ${(props) => props.theme.color.colorText};
	border-radius: 8px;
	padding: 8px;
	@media screen and ${MediaQueries.xs} {
		width: 15rem;
		flex-direction: row;
	}
`

const WrapperPoints = styled.div`
	width: 100%;
	@media screen and ${MediaQueries.xs} {
		width: 0;
		flex-grow: 1;
	}
`

const WrapperChild = styled.p`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: block;
	margin: 0 auto;
	width: 100%;
	@media screen and ${MediaQueries.xs} {
		width: 75%;
	}
`

const PlayerName = styled(WrapperChild).attrs({ as: 'button', type: 'button' })`
	padding: 0;
	background: none;
	border: none;
	color: inherit;
	font-family: inherit;
	font-size: 0.75em;
	text-align: center;
	cursor: pointer;
	&:focus-visible {
		outline: 3px solid ${(props) => props.theme.color.borderColorInputFocus};
		outline-offset: 2px;
	}
`

const PlayerScore = styled(WrapperChild)`
	font-size: 2em;
	text-align: center;
`

const CurrentPlayerIndicator = styled.div<{ $currentPlayer: number }>`
	position: relative;
	height: 2px;
	background-color: ${(props) => props.theme.color.borderColorGrid};
	border-radius: 8px;
	transition: all 0.3s;
	width: 75%;
	margin: 1rem 0;
	&:after {
		content: '';
		display: block;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: ${(props) => (props.$currentPlayer === 0 ? 8 : 0)}px solid
			${(props) => props.theme.color.borderColorGrid}; // p1
		border-top: ${(props) => (props.$currentPlayer === 0 ? 0 : 8)}px solid
			${(props) => props.theme.color.borderColorGrid}; // p2
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: ${(props) => (props.$currentPlayer === 0 ? 2 : -8)}px;
		transition: all 0.3s;
	}
	@media screen and ${MediaQueries.xs} {
		height: 55.5px;
		width: 2px;
		margin: 0 1rem;
		&:after {
			border-top: 8px solid transparent;
			border-bottom: 8px solid transparent;
			border-right: ${(props) => (props.$currentPlayer === 0 ? 8 : 0)}px solid
				${(props) => props.theme.color.borderColorGrid};
			border-left: ${(props) => (props.$currentPlayer === 0 ? 0 : 8)}px solid
				${(props) => props.theme.color.borderColorGrid};
			left: ${(props) => (props.$currentPlayer === 0 ? -8 : 2)}px;
			transform: none;
			bottom: 38%;
		}
	}
`

const Score = ({ currentPlayer, players, onClickChangeName }: ScoreProps) => {
	if (players.length !== 2) {
		throw new Error('This game only supports 2 players')
	}

	const handleClickChangeName = (player: Player) => () =>
		onClickChangeName(player)

	const renderName = (index: number, mark: string) => (
		<PlayerName
			aria-label={`${players[index].name} (${mark}), change name`}
			aria-current={currentPlayer === index ? 'true' : undefined}
			onClick={handleClickChangeName(players[index])}
		>
			{players[index].name} ({mark})
		</PlayerName>
	)

	return (
		<Wrapper role="group" aria-label="Score">
			<WrapperPoints>
				{renderName(0, 'X')}
				<PlayerScore>
					{players[0].score > 99 ? '+99' : players[0].score}
				</PlayerScore>
			</WrapperPoints>
			<CurrentPlayerIndicator
				$currentPlayer={currentPlayer}
				aria-hidden="true"
			/>
			<WrapperPoints>
				{renderName(1, 'O')}
				<PlayerScore>
					{players[1].score > 99 ? '+99' : players[1].score}
				</PlayerScore>
			</WrapperPoints>
		</Wrapper>
	)
}

export default Score
