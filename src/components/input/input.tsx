import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

export interface InputProps {
	label: string
	name: string
	value?: string | number
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	[property: string]: unknown
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`

const InputWrapper = styled.input`
	background: none;
	border: 2px solid ${(props) => props.theme.color.borderColorInput};
	border-radius: 4px;
	padding: 0.5rem 1rem;
	color: ${(props) => props.theme.color.colorText};
	transition: all 0.3s;
	&:focus {
		border-color: ${(props) => props.theme.color.borderColorInputFocus};
	}
	&:focus-visible {
		outline: 2px solid ${(props) => props.theme.color.borderColorInputFocus};
		outline-offset: 2px;
	}
`

const Label = styled.label`
	margin: 0 0 0.5rem;
`

const Input = ({ name, label, value = '', onChange, ...rest }: InputProps) => {
	const [innerValue, setInnerValue] = useState(value)

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInnerValue(event.target.value)
		onChange(event)
	}

	return (
		<Wrapper>
			<Label htmlFor={name}>{label}</Label>
			<InputWrapper
				{...rest}
				id={name}
				value={innerValue}
				onChange={handleOnChange}
			/>
		</Wrapper>
	)
}

export default Input
