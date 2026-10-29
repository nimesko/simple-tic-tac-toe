export function processKeyNumber(n: number): number {
	if (n > 9 || n < 1) {
		throw new Error('Number must be less that 10 and greater than 0')
	}
	if (n > 6) {
		return n - 7
	}
	if (n > 3) {
		return n - 1
	}
	return n + 5
}
