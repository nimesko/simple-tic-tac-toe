import React from 'react'
import styled from 'styled-components'
import VisuallyHidden from '@components/visually-hidden/visually-hidden'
import { formatNumber } from '@utils/number'

export interface TableProps {
	columnDefinitions: { header: string; field: string }[]
	rowDefinitions: { keyField: string }
	data: object[]
	caption?: string
}

const Table = styled.table`
	border-collapse: collapse;
	border-spacing: 0px;
	color: ${(props) => props.theme.color.colorText};
	width: 100%;
`

const TableHeader = styled.thead`
	font-size: bold;
`

const TableBody = styled.tbody``

const TableRow = styled.tr`
	vertical-align: middle;
	outline: 0px;
`

const TableData = styled.td`
	font-size: 0.875rem;
	line-height: 1.43;
	letter-spacing: 0.01071em;
	vertical-align: inherit;
	border-bottom: 1px solid ${(props) => props.theme.color.borderColorTable};
	text-align: left;
	padding: 16px;
`

const TableHeaderData = styled(TableData)``

const TableBodyData = styled(TableData)``

function renderValue(
	data: Record<string, number | string>,
	field: string,
): string {
	const value = data[field]

	if (typeof value === 'number') {
		return formatNumber(value)
	}
	return value
}

const TableWrapper = ({
	columnDefinitions,
	rowDefinitions,
	data,
	caption,
}: TableProps) => {
	if (!columnDefinitions || columnDefinitions.length === 0) {
		throw new Error('Column definitions must be defined')
	}
	return (
		<Table>
			{caption && <VisuallyHidden as="caption">{caption}</VisuallyHidden>}
			<TableHeader>
				<TableRow>
					{columnDefinitions.map(({ header }) => (
						<TableHeaderData as="th" scope="col" key={header}>
							{header}
						</TableHeaderData>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((obj) => {
					const value = obj as Record<string, number | string>
					const key = value[rowDefinitions.keyField]
					return (
						<TableRow key={key}>
							{columnDefinitions.map(({ field }) => (
								<TableBodyData as="td" key={`${key}_${field}`}>
									{renderValue(value, field)}
								</TableBodyData>
							))}
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

export default TableWrapper
