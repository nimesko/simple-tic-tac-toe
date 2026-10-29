import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import styled from 'styled-components'
import Input from '@components/input/input'
import Button from '@components/button/button'

export interface FormPlayerProps {
	value: { name: string }
	onSubmit: (form: { name: string }) => void
}

const Form = styled.form`
	width: 100%;
`

const Submit = styled(Button)`
	margin: 1rem 0 0;
`

const FormPlayer = ({ value, onSubmit }: FormPlayerProps) => {
	const [form, setForm] = useState(value)

	const handleOnChange =
		(field: string) => (event: ChangeEvent<HTMLInputElement>) => {
			setForm({
				...form,
				[field]: event.target.value,
			})
		}

	const handleOnSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(form)
		return false
	}

	const handleOnClickForm = (event: MouseEvent) => {
		event.stopPropagation()
		return false
	}

	return (
		<Form onClick={handleOnClickForm} onSubmit={handleOnSubmit}>
			<Input
				name="name"
				label="Name"
				value={form.name}
				onChange={handleOnChange('name')}
				required
			/>
			<Submit type="submit">Save</Submit>
		</Form>
	)
}

export default FormPlayer
