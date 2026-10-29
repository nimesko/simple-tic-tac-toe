import { formatNumber } from '../number'

describe('number', () => {
	describe('formatNumber', () => {
		test('should format without separator', () => {
			;[0, 5, 50, 100, 500, 999].forEach((number) => {
				expect(formatNumber(number)).toEqual(`${number}`)
			})
		})

		test('should format with one separator', () => {
			;[1000, 5000, 50000, 100000, 500000, 999000].forEach((number) => {
				const formatted = formatNumber(number)

				expect(formatted).toHaveLength(`${number}`.length + 1)
				expect(formatted.replace(/\d/g, '')).toHaveLength(1)
			})
		})

		test('should format with two separators', () => {
			;[1000000, 5000000, 50000000, 100000000, 500000000, 999000000].forEach(
				(number) => {
					const formatted = formatNumber(number)

					expect(formatted).toHaveLength(`${number}`.length + 2)
					expect(formatted.replace(/\d/g, '')).toHaveLength(2)
				},
			)
		})
	})
})
