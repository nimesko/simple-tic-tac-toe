class FakeAudio {
	src = ''
	currentTime = 5
	play = vi.fn().mockResolvedValue(undefined)
}

let audio: FakeAudio

const loadSound = async () => {
	vi.resetModules()
	vi.stubGlobal(
		'Audio',
		class {
			constructor() {
				audio = new FakeAudio()
				return audio
			}
		},
	)
	return (await import('../sound')).default
}

describe('sound', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	test.each([
		['playMove', 'move.wav'],
		['playWin', 'win.wav'],
		['playTie', 'tie.wav'],
	] as const)('%s should play %s', async (method, file) => {
		const Sound = await loadSound()

		await Sound[method]()

		expect(audio.src).toBe(file)
		expect(audio.play).toHaveBeenCalledTimes(1)
	})

	test('should keep the source when playing the same sound again', async () => {
		const Sound = await loadSound()

		await Sound.playMove()
		audio.src = 'move.wav'
		await Sound.playMove()

		expect(audio.src).toBe('move.wav')
		expect(audio.play).toHaveBeenCalledTimes(2)
	})

	test('should change the source when playing a different sound', async () => {
		const Sound = await loadSound()

		await Sound.playMove()
		await Sound.playWin()

		expect(audio.src).toBe('win.wav')
	})

	test('should rewind the audio when play fails', async () => {
		const Sound = await loadSound()
		audio.play.mockRejectedValueOnce(new Error('NotAllowedError'))

		await Sound.playMove()

		expect(audio.currentTime).toBe(0)
	})
})
