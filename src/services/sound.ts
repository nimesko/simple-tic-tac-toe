const SOUND_MOVE = 'move.wav'
const SOUND_WIN = 'win.wav'
const SOUND_TIE = 'tie.wav'

function createSound() {
	const audio = new Audio()

	async function playSound(src: string) {
		if (audio.src !== src) {
			audio.src = src
		}
		try {
			await audio.play()
		} catch {
			audio.currentTime = 0
		}
	}

	return {
		playWin: () => playSound(SOUND_WIN),
		playMove: () => playSound(SOUND_MOVE),
		playTie: () => playSound(SOUND_TIE),
	}
}

export default createSound()
