import React from 'react'
import styled from 'styled-components'
import CircleIcon from '@components/circle-icon/circle-icon'
import CrossIcon from '@components/cross-icon/cross-icon'

export interface FieldProps {
	position: number
	size: number
	player?: number
	disabled?: boolean
	onClick: ({ position }: { position: number }) => void
}

const FieldComponent = styled.button.withConfig({
	shouldForwardProp: (props) => !['size'].includes(props),
})<{ size: number }>`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 0;
	background: none;
	border: none;
	cursor: pointer;
	font: inherit;
	border-right: 1px solid ${(props) => props.theme.color.borderColorGrid};
	border-bottom: 1px solid ${(props) => props.theme.color.borderColorGrid};
	font-family: sans-serif;
	color: ${(props) => props.theme.color.colorIconGrid};
	&:disabled {
		cursor: default;
	}
	&:focus-visible {
		outline: 3px solid ${(props) => props.theme.color.borderColorInputFocus};
		outline-offset: -6px;
	}
	&:nth-child(${({ size }) => size}n) {
		border-right: none;
	}
	&:nth-last-child(-n + ${({ size }) => size}) {
		border-bottom: none;
	}
	> * {
		width: 75%;
	}
`

const PLAYER_MARKS = ['X', 'O']

const describeCell = (position: number, size: number, player?: number) => {
	const row = Math.floor(position / size) + 1
	const column = (position % size) + 1
	const mark = player === undefined ? undefined : PLAYER_MARKS[player]

	return `Row ${row}, column ${column}, ${mark ?? 'empty'}`
}

const Field = ({ player, position, size, disabled, onClick }: FieldProps) => {
	const handleOnClick = () => {
		onClick({ position })
	}

	return (
		<FieldComponent
			type="button"
			aria-label={describeCell(position, size, player)}
			disabled={disabled}
			onClick={handleOnClick}
			size={size}
		>
			{player === 0 ? <CrossIcon /> : player === 1 ? <CircleIcon /> : ''}
		</FieldComponent>
	)
}

export default Field
