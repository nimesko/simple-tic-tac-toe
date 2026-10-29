const NUMBER_INTL = new Intl.NumberFormat()

export function formatNumber(num: number): string {
	return NUMBER_INTL.format(num)
}
