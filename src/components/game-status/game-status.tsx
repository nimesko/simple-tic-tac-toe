import React from 'react'
import VisuallyHidden from '@components/visually-hidden/visually-hidden'

export interface GameStatusProps {
	message: string
}

// Announces the game progress (whose turn it is, the winner) to screen readers
const GameStatus = ({ message }: GameStatusProps) => {
	return (
		<VisuallyHidden
			as="div"
			role="status"
			aria-live="polite"
			aria-atomic="true"
		>
			{message}
		</VisuallyHidden>
	)
}

export default GameStatus
