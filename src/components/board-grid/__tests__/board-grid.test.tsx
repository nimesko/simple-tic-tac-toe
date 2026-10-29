import { render } from '@testing-library/react'
import React from 'react'
import BoardGrid from '../board-grid'

describe('BoardGrid', () => {
	test('should render', () => {
		render(<BoardGrid size={3} disabled={false} />)
		render(<BoardGrid size={3} disabled={true} />)

		render(<BoardGrid size={4} disabled={false} />)
		render(<BoardGrid size={4} disabled={true} />)
	})
})
