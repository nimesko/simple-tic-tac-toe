// jsdom does not implement canvas, axe-core uses it to detect icon ligatures
// and only needs text metrics and pixel data to be present
export function stubCanvasContext() {
	return vi
		.spyOn(HTMLCanvasElement.prototype, 'getContext')
		.mockImplementation(function (this: HTMLCanvasElement) {
			return {
				canvas: this,
				font: '',
				textAlign: 'left',
				textBaseline: 'top',
				fillText: vi.fn(),
				clearRect: vi.fn(),
				measureText: (text: string) => ({ width: text.length }),
				getImageData: (_x: number, _y: number, w: number, h: number) => ({
					data: new Uint8ClampedArray(Math.max(w * h * 4, 4)),
				}),
			}
		} as unknown as HTMLCanvasElement['getContext'])
}
