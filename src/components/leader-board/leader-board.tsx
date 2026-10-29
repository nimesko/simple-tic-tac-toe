import Table from '@components/table/table'
import { PlayerRank } from '@models/game'
import React from 'react'
import styled from 'styled-components'

export interface LeaderBoardProps {
	players: PlayerRank[]
}

const Wrapper = styled.div`
	width: 100%;
`

const NoBodyScored = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
	border: 1px solid ${(props) => props.theme.color.borderColorGrid};
	color: ${(props) => props.theme.color.colorText};
	border-radius: 8px;
	padding: 8px;
`

const LEADER_BOARD_COLUMNS_DEFINITIONS = [
	{
		header: 'Rank',
		field: 'rank',
	},
	{
		header: 'Name',
		field: 'name',
	},
	{
		header: 'Score',
		field: 'score',
	},
]

const LEADER_BOARD_ROW_DEFINITIONS = {
	keyField: 'id',
}

const LeaderBoard = ({ players }: LeaderBoardProps) => {
	if (players.length === 0) {
		return (
			<Wrapper>
				<NoBodyScored>Nobody scored yet</NoBodyScored>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<Table
				columnDefinitions={LEADER_BOARD_COLUMNS_DEFINITIONS}
				rowDefinitions={LEADER_BOARD_ROW_DEFINITIONS}
				caption="Leaderboard"
				data={players}
			/>
		</Wrapper>
	)
}

export default LeaderBoard
