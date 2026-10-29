import { faker } from '@faker-js/faker'
import { processKeyNumber } from '../event'

describe('event', () => {
	describe('processKeyNumber', () => {
		test('should process numbers', () => {
			new Array(9).fill(0).forEach((_, index) => {
				const number = processKeyNumber(index + 1)

				expect(number).toBeGreaterThanOrEqual(0)
				expect(number).toBeLessThanOrEqual(9)
			})
		})

		test('should raise an error', () => {
			new Array(100).fill(0).forEach(() => {
				const number = faker.number.int({ min: 10, max: 99999 })
				expect(() => processKeyNumber(number)).toThrow()
			})
		})
	})
})
