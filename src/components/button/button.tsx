import React, { MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'

export interface ButtonProps {
	children: ReactNode
	type?: 'submit' | 'reset' | 'button'
	onClick?: (event: MouseEvent) => void
}

const ButtonComponent = styled.button`
	margin: 0px;
	letter-spacing: 0.02857em;
	text-transform: uppercase;
	padding: 5px 15px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s;
	background-color: ${(props) => props.theme.color.backgroundButton};
	border: 1px solid ${(props) => props.theme.color.borderColorButton};
	color: ${(props) => props.theme.color.colorButtonText};
	min-height: 36px;
	font-weight: bold;
	width: 100%;
	&:focus-visible {
		outline: 3px solid ${(props) => props.theme.color.borderColorInputFocus};
		outline-offset: 2px;
	}
	&:hover {
		text-decoration: none;
		background-color: ${(props) => props.theme.color.backgroundButtonHover};
		color: ${(props) => props.theme.color.colorButtonTextHover};
	}
`

const Button = ({ children, onClick, type, ...rest }: ButtonProps) => {
	const handleOnClick = (event: MouseEvent) => {
		onClick?.(event)
	}

	return (
		<ButtonComponent {...rest} onClick={handleOnClick} type={type}>
			{children}
		</ButtonComponent>
	)
}

Button.defaultProps = {
	type: 'button',
}

export default Button
