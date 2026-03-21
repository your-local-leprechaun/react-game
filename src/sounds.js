import selectSfx  from './assets/select.wav'
import deadSfx    from './assets/dead.wav'
import powerupSfx from './assets/powerup.mp3'
import goSfx      from './assets/GO.wav'
import hurtSfx    from './assets/hurt.wav'

const play = (src, volume = 1, pitchRange = 0) => {
    const audio = new Audio(src)
    audio.volume = volume
    if (pitchRange) audio.playbackRate = 1 + (Math.random() * pitchRange * 2 - pitchRange)
    audio.play().catch(() => {})
}

export const playSelect  = () => play(selectSfx,  0.3, 0.1)
export const playDead    = () => play(deadSfx,     1)
export const playPowerup = () => play(powerupSfx,  1,   0.15)
export const playGo      = () => play(goSfx,       1)
export const playHurt    = () => play(hurtSfx,     1,   0.12)
