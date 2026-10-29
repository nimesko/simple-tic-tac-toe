import { render, screen } from '@testing-library/react'
import React from 'react'
import GameStatus from '../game-status'

describe('GameStatus', () => {
	test('should announce the message politely and completely', () => {
		render(<GameStatus message="Player 1's turn (X)" />)

		const status = screen.getByRole('status')

		expect(status.textContent).toBe("Player 1's turn (X)")
		expect(status.getAttribute('aria-live')).toBe('polite')
		expect(status.getAttribute('aria-atomic')).toBe('true')
	})

	test('should announce a new message', () => {
		const { rerender } = render(<GameStatus message="Player 1's turn (X)" />)

		rerender(<GameStatus message="Player 2's turn (O)" />)

		expect(screen.getByRole('status').textContent).toBe("Player 2's turn (O)")
	})
})
