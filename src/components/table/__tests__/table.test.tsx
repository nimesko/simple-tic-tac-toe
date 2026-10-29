import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { DarkTheme } from '@theme/theme'
import Table, { TableProps } from '../table'
import { ThemeProvider } from 'styled-components'
import { formatNumber } from '@utils/number'

const generateProps = ({
	hasColumns,
	totalRegistries,
}: {
	hasColumns: boolean
	totalRegistries: number
}): TableProps => {
	return {
		columnDefinitions: hasColumns
			? [
					{ header: 'ID', field: 'id' },
					{ header: 'Full Name', field: 'name' },
					{ header: 'Random Number', field: 'number' },
				]
			: [],
		rowDefinitions: { keyField: 'id' },
		data: new Array(totalRegistries).fill(0).map((_, index) => ({
			id: index + 1,
			name: faker.person.fullName(),
			number: faker.number.int({ max: 99999 }),
		})),
	}
}

const renderComponent = (props: TableProps) => {
	return (
		<ThemeProvider theme={DarkTheme}>
			<Table {...props} />
		</ThemeProvider>
	)
}

describe('Table', () => {
	test('should render', () => {
		const props = generateProps({ hasColumns: true, totalRegistries: 5 })

		render(renderComponent(props))

		props.columnDefinitions.forEach((columnDefinition) =>
			expect(screen.getByText(columnDefinition.header)).toBeTruthy(),
		)

		props.data.forEach((d) =>
			Object.values(d).forEach((value) => {
				if (typeof value === 'number' && value > 999) {
					expect(screen.getByText(formatNumber(value))).toBeTruthy()
				} else {
					expect(screen.getByText(value)).toBeTruthy()
				}
			}),
		)
	})

	test('should render only headers', () => {
		const props = generateProps({ hasColumns: true, totalRegistries: 0 })

		render(renderComponent(props))

		props.columnDefinitions.forEach((columnDefinition) =>
			expect(screen.getByText(columnDefinition.header)).toBeTruthy(),
		)
	})

	test('should throw error without headers', () => {
		const props = generateProps({ hasColumns: false, totalRegistries: 5 })
		expect(() => render(renderComponent(props))).toThrow()
	})

	describe('accessibility', () => {
		test('should mark the headers as column headers', () => {
			render(
				renderComponent(
					generateProps({ hasColumns: true, totalRegistries: 2 }),
				),
			)

			const headers = screen.getAllByRole('columnheader')

			expect(headers).toHaveLength(3)
			headers.forEach((header) =>
				expect(header.getAttribute('scope')).toBe('col'),
			)
		})

		test('should have a caption when provided', () => {
			render(
				renderComponent({
					...generateProps({ hasColumns: true, totalRegistries: 1 }),
					caption: 'Players',
				}),
			)

			expect(screen.getByRole('table', { name: 'Players' })).toBeTruthy()
		})

		test('should not have a caption by default', () => {
			const { container } = render(
				renderComponent(
					generateProps({ hasColumns: true, totalRegistries: 1 }),
				),
			)

			expect(container.querySelector('caption')).toBeNull()
		})
	})
})
