import LocalStorage, { LocalStorageKey } from '../local-storage'

describe('localStorage', () => {
	test('should store the key with random value', () => {
		LocalStorage.store(LocalStorageKey.Rank, 'testing')

		expect(LocalStorage.get(LocalStorageKey.Rank)).toBeTruthy()
	})

	test('should remove the key', () => {
		LocalStorage.store(LocalStorageKey.Rank, 'testing')

		expect(LocalStorage.get(LocalStorageKey.Rank)).toBeTruthy()

		LocalStorage.remove(LocalStorageKey.Rank)

		expect(LocalStorage.get(LocalStorageKey.Rank)).not.toBeTruthy()
	})

	test('should get the primitive value with default value', () => {
		const defaultValue = 'default'
		const value = 'testing'

		LocalStorage.store(LocalStorageKey.Rank, value)

		expect(LocalStorage.get(LocalStorageKey.Rank, defaultValue)).toBe(value)
	})

	test('should get the primitive value without default value', () => {
		const value = 'testing'

		LocalStorage.store(LocalStorageKey.Rank, value)

		expect(LocalStorage.get(LocalStorageKey.Rank)).toBe(value)
	})

	test('should get object value with default value', () => {
		const defaultValue = 'default'
		const value = { a: 1, b: 'testing', c: true, d: { e: [{ f: false }] } }

		LocalStorage.store(LocalStorageKey.Rank, value)

		expect(LocalStorage.get(LocalStorageKey.Rank, defaultValue)).toStrictEqual(
			value,
		)
	})

	test('should get object value without default value', () => {
		const value = { a: 1, b: 'testing', c: true, d: { e: [{ f: false }] } }

		LocalStorage.store(LocalStorageKey.Rank, value)

		expect(LocalStorage.get(LocalStorageKey.Rank)).toStrictEqual(value)
	})

	test('should get nothing with default value', () => {
		LocalStorage.remove(LocalStorageKey.Rank)

		const defaultValue = 'default'

		expect(LocalStorage.get(LocalStorageKey.Rank, defaultValue)).toStrictEqual(
			defaultValue,
		)
	})

	test('should get nothing without default value', () => {
		LocalStorage.remove(LocalStorageKey.Rank)

		expect(LocalStorage.get(LocalStorageKey.Rank)).not.toBeTruthy()
	})
})
