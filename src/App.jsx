import { useState, useEffect, useRef } from 'react'
import music from './assets/music.mp3'
import MenuScreen from './screens/MenuScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import GameOverScreen from './screens/GameOverScreen.jsx'
import ScoreboardScreen from './screens/ScoreboardScreen.jsx'

function App() {
    const [screen, setScreen] = useState('menu')
    const [finalDistance, setFinalDistance] = useState(0)
    const audioRef = useRef(null)

    useEffect(() => {
        const audio = new Audio(music)
        audio.loop = true
        audio.volume = 0.1
        audio.preload = 'auto'
        audioRef.current = audio

        const startMusic = () => audio.play().catch(() => {})

        // Try immediately, start on first click if blocked
        audio.play().catch(() => {})
        window.addEventListener('click', startMusic, { once: true })

        return () => {
            audio.pause()
            window.removeEventListener('click', startMusic)
        }
    }, [])

    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = screen === 'game' ? 0.4 : 0.1
    }, [screen])

    const handleGameOver = (distance) => {
        setFinalDistance(distance)
        setScreen('gameover')
    }

    return (
        <>
            {/* Scanlines — always on */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)',
            }} />

            {/* Vignette — menu screens only */}
            {screen !== 'game' && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 998, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)',
                }} />
            )}

            {screen === 'menu'       && <MenuScreen onPlay={() => setScreen('game')} onScoreboard={() => setScreen('scoreboard')} />}
            {screen === 'game'       && <GameScreen onGameOver={handleGameOver} onMenu={() => setScreen('menu')} />}
            {screen === 'gameover'   && <GameOverScreen distance={finalDistance} onPlay={() => setScreen('game')} onMenu={() => setScreen('menu')} onScoreboard={() => setScreen('scoreboard')} />}
            {screen === 'scoreboard' && <ScoreboardScreen onMenu={() => setScreen('menu')} />}
        </>
    )
}

export default App
