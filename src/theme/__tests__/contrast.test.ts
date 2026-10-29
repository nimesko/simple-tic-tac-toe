import { ColorPalete } from '@models/theme'
import { DarkTheme, LightTheme } from '../theme'

type Rgb = [number, number, number]

// WCAG 2.2 AA: 4.5 for text, 3 for user interface components and large text
const TEXT = 4.5
const COMPONENT = 3

const parse = (hex: string): { rgb: Rgb; alpha: number } => {
	const value = hex.replace('#', '')
	const full = value.length === 3 ? value.replace(/./g, '$&$&') : value
	const channel = (index: number) => parseInt(full.slice(index, index + 2), 16)

	return {
		rgb: [channel(0), channel(2), channel(4)],
		alpha: full.length === 8 ? channel(6) / 255 : 1,
	}
}

// Draws a (possibly translucent) colour over an opaque background
const flatten = (foreground: string, background: string): Rgb => {
	const { rgb, alpha } = parse(foreground)
	const base = parse(background).rgb

	return rgb.map((c, i) => Math.round(c * alpha + base[i] * (1 - alpha))) as Rgb
}

const luminance = ([r, g, b]: Rgb) => {
	const [lr, lg, lb] = [r, g, b].map((c) => {
		const s = c / 255
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

const contrast = (a: Rgb, b: Rgb) => {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
	return (light + 0.05) / (dark + 0.05)
}

const ratio = (foreground: string, background: string, under = background) => {
	const base = flatten(background, under)
	return contrast(flatten(foreground, background), base)
}

const pairs = (c: ColorPalete): [string, string, string, number][] => [
	['text on the page', c.colorText, c.background, TEXT],
	['text on the end game overlay', c.colorText, c.backgroundEndGame, TEXT],
	['text on dialogs', c.colorText, c.backgroundDialog, TEXT],
	['text on the page while hovering', c.colorTextHover, c.background, TEXT],
	['button text', c.colorButtonText, c.backgroundButton, TEXT],
	[
		'button text while hovering',
		c.colorButtonTextHover,
		c.backgroundButtonHover,
		TEXT,
	],
	['button border', c.borderColorButton, c.background, COMPONENT],
	['grid lines', c.borderColorGrid, c.background, COMPONENT],
	['grid marks', c.colorIconGrid, c.background, COMPONENT],
	['table borders', c.borderColorTable, c.background, COMPONENT],
	['input border', c.borderColorInput, c.background, COMPONENT],
	['input focus border', c.borderColorInputFocus, c.background, COMPONENT],
	['loading bar', c.backgroundLoading, c.background, COMPONENT],
]

describe.each([
	['dark', DarkTheme],
	['light', LightTheme],
])('contrast (%s theme)', (_, theme) => {
	test.each(pairs(theme.color))(
		'%s',
		(name, foreground, background, minimum) => {
			const under =
				name.includes('dialog') || name.includes('overlay')
					? theme.color.background
					: background

			expect(ratio(foreground, background, under)).toBeGreaterThanOrEqual(
				minimum,
			)
		},
	)
})

describe('contrast helpers', () => {
	test('should compute the WCAG ratio of black and white', () => {
		expect(ratio('#000000', '#ffffff')).toBeCloseTo(21, 5)
		expect(ratio('#fff', '#fff')).toBeCloseTo(1, 5)
	})

	test('should flatten translucent colours over the background', () => {
		expect(flatten('#00000080', '#ffffff')).toStrictEqual([127, 127, 127])
	})
})
