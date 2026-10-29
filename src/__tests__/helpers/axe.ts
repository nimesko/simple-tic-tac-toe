import axe, { AxeResults } from 'axe-core'

// Colour contrast cannot be computed by jsdom, it is covered by the theme contrast tests
const RULES = { 'color-contrast': { enabled: false } }

const TAGS = [
	'wcag2a',
	'wcag2aa',
	'wcag21a',
	'wcag21aa',
	'wcag22aa',
	'best-practice',
]

const format = ({ violations }: AxeResults) =>
	violations
		.map(({ id, impact, help, helpUrl, nodes }) => {
			const targets = nodes
				.map((node) => `    - ${node.target.join(' ')}`)
				.join('\n')
			return `[${impact}] ${id}: ${help}\n${targets}\n    ${helpUrl}`
		})
		.join('\n\n')

export async function scan(element: Element = document.body) {
	const results = await axe.run(element, { runOnly: TAGS, rules: RULES })

	return { results, report: format(results) }
}
