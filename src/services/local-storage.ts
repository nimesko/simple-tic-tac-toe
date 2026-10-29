const NAMESPACE = 'tic-tac-toe'

export enum LocalStorageKey {
	Rank = 'rank',
	Sound = 'sound',
}

function createLocalStorage() {
	function buildKey(key: LocalStorageKey): string {
		return `${NAMESPACE}.${key}`
	}

	return {
		store: (key: LocalStorageKey, value: unknown): void => {
			localStorage.setItem(buildKey(key), JSON.stringify(value))
		},
		remove: (key: LocalStorageKey): void => {
			localStorage.removeItem(buildKey(key))
		},
		get: <T>(key: LocalStorageKey, defaultValue?: T): T | undefined => {
			try {
				const stored = localStorage.getItem(buildKey(key))
				return JSON.parse(stored || '')
			} catch {
				return defaultValue
			}
		},
	}
}

export default createLocalStorage()
