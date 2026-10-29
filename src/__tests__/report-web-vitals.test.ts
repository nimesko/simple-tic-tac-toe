import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import reportWebVitals from '../report-web-vitals'

vi.mock('web-vitals', () => ({
	onCLS: vi.fn(),
	onFCP: vi.fn(),
	onINP: vi.fn(),
	onLCP: vi.fn(),
	onTTFB: vi.fn(),
}))

const metrics = [onCLS, onFCP, onINP, onLCP, onTTFB]

describe('reportWebVitals', () => {
	test('should report every metric to the callback', () => {
		const callback = vi.fn()

		reportWebVitals(callback)

		metrics.forEach((metric) => expect(metric).toHaveBeenCalledWith(callback))
	})

	test('should do nothing without a callback', () => {
		reportWebVitals()

		metrics.forEach((metric) => expect(metric).not.toHaveBeenCalled())
	})

	test('should do nothing when the callback is not a function', () => {
		reportWebVitals('callback' as never)

		metrics.forEach((metric) => expect(metric).not.toHaveBeenCalled())
	})
})
