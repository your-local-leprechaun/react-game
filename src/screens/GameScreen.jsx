import { useState, useEffect, useRef } from 'react'
import Player from '../components/Player.jsx'
import Car from '../components/Car.jsx'
import Road from '../components/Road.jsx'
import HUD from '../components/HUD.jsx'
import Countdown from '../components/Countdown.jsx'
import Powerup, { POWERUP_TYPES } from '../components/Powerup.jsx'
import { playDead, playPowerup, playSelect, playHurt } from '../sounds.js'

const PLAYER_W = 50
const PLAYER_H = 25
const PLAYER_SPEED = 10
const BASE_GAME_SPEED = 3
const POWERUP_KEYS = Object.keys(POWERUP_TYPES)

function GameScreen({ onGameOver, onMenu }) {
    const [phase, setPhase] = useState('countdown')
    const [playerPos, setPlayerPos] = useState({ x: 100, y: window.innerHeight / 2 })
    const [lives, setLives] = useState(3)
    const [distance, setDistance] = useState(0)
    const [gameSpeed, setGameSpeed] = useState(BASE_GAME_SPEED)
    const [cars, setCars] = useState([])
    const [powerups, setPowerups] = useState([])
    const [invincible, setInvincible] = useState(false)

    // Active power-up effects
    const [shieldActive, setShieldActive] = useState(false)
    const [slowmoActive, setSlowmoActive] = useState(false)
    const [multiplierActive, setMultiplierActive] = useState(false)

    const gameSpeedRef = useRef(BASE_GAME_SPEED)
    const distanceRef = useRef(0)
    const invincibleUntil = useRef(0)
    const pausedRef = useRef(true)
    const shieldRef = useRef(false)
    const multiplierRef = useRef(false)

    // Timer refs for power-ups so we can reset them
    const shieldTimer = useRef(null)
    const slowmoTimer = useRef(null)
    const multiplierTimer = useRef(null)

    useEffect(() => { pausedRef.current = phase !== 'playing' }, [phase])
    useEffect(() => { gameSpeedRef.current = gameSpeed }, [gameSpeed])
    useEffect(() => { distanceRef.current = distance }, [distance])
    useEffect(() => { shieldRef.current = shieldActive }, [shieldActive])
    useEffect(() => { multiplierRef.current = multiplierActive }, [multiplierActive])

    // Game over when lives hit 0
    useEffect(() => {
        if (lives <= 0) {
            playDead()
            setTimeout(() => onGameOver(Math.floor(distanceRef.current)), 1500)
        }
    }, [lives])

    // Escape to pause/resume
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') return
            setPhase(prev => {
                if (prev === 'playing') return 'paused'
                if (prev === 'paused') return 'countdown'
                return prev
            })
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Player movement
    useEffect(() => {
        const keys = {}
        const handleKeyDown = (e) => { keys[e.key] = true }
        const handleKeyUp = (e) => { keys[e.key] = false }
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        const loop = setInterval(() => {
            if (pausedRef.current) return
            setPlayerPos(prev => {
                let { x, y } = prev
                let dx = 0, dy = 0
                if (keys['ArrowUp'] || keys['w']) dy -= 1
                if (keys['ArrowDown'] || keys['s']) dy += 1
                if (keys['ArrowLeft'] || keys['a']) dx -= 1
                if (keys['ArrowRight'] || keys['d']) dx += 1

                const len = Math.sqrt(dx * dx + dy * dy)
                if (len > 0) {
                    x += (dx / len) * PLAYER_SPEED
                    y += (dy / len) * PLAYER_SPEED
                }
                if (y < 0) y = 0
                if (y > windowHeight - PLAYER_H) y = windowHeight - PLAYER_H
                if (x < 0) x = 0
                if (x > windowWidth - PLAYER_W) x = windowWidth - PLAYER_W
                return { x, y }
            })
        }, 16)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            clearInterval(loop)
        }
    }, [])

    // Distance counter — 2× when multiplier active
    useEffect(() => {
        const loop = setInterval(() => {
            if (pausedRef.current) return
            const mult = multiplierRef.current ? 2 : 1
            setDistance(prev => prev + gameSpeedRef.current * 0.1 * mult)
        }, 16)
        return () => clearInterval(loop)
    }, [])

    // Difficulty ramp — increment grows with speed, no hard cap
    useEffect(() => {
        const ramp = setInterval(() => {
            if (pausedRef.current) return
            setGameSpeed(prev => prev + Math.max(0.5, prev * 0.08))
        }, 3000)
        return () => clearInterval(ramp)
    }, [])

    // Car spawning — faster interval + multiple cars at high speed
    useEffect(() => {
        const spawnInterval = Math.max(150, 800 - (gameSpeed - BASE_GAME_SPEED) * 50)
        const count = Math.min(4, 1 + Math.floor(gameSpeed / 15))
        const interval = setInterval(() => {
            if (pausedRef.current) return
            const newCars = Array.from({ length: count }, () => {
                const h = Math.floor(Math.random() * 30) + 20
                const w = Math.floor(Math.random() * 40) + 60
                const y = Math.floor(Math.random() * (window.innerHeight - h))
                const speed = gameSpeedRef.current + Math.floor(Math.random() * 4)
                return { id: Date.now() + Math.random(), y, w, h, speed }
            })
            setCars(prev => [...prev, ...newCars])
        }, spawnInterval)
        return () => clearInterval(interval)
    }, [gameSpeed])

    // Power-up spawning — every 8s
    useEffect(() => {
        const interval = setInterval(() => {
            if (pausedRef.current) return
            const type = POWERUP_KEYS[Math.floor(Math.random() * POWERUP_KEYS.length)]
            const y = Math.floor(Math.random() * (window.innerHeight - 42))
            const speed = gameSpeedRef.current + Math.floor(Math.random() * 3)
            setPowerups(prev => [...prev, { id: Date.now(), type, y, speed }])
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    const removeCar = (id) => setCars(prev => prev.filter(c => c.id !== id))
    const removePowerup = (id) => setPowerups(prev => prev.filter(p => p.id !== id))

    const activateEffect = (setter, timerRef, duration) => {
        setter(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setter(false), duration)
    }

    const handleCollect = (id, type) => {
        removePowerup(id)
        playPowerup()
        if (type === 'life')       setLives(prev => Math.min(prev + 1, 5))
        if (type === 'multiplier') activateEffect(setMultiplierActive, multiplierTimer, 10000)
        if (type === 'shield')     activateEffect(setShieldActive, shieldTimer, 6000)
        if (type === 'slowmo')     activateEffect(setSlowmoActive, slowmoTimer, 6000)
    }

    const onHit = () => {
        if (shieldRef.current) return
        if (Date.now() < invincibleUntil.current) return
        invincibleUntil.current = Date.now() + 2000
        setLives(prev => {
            if (prev > 1) playHurt()
            return prev - 1
        })
        setInvincible(true)
        setTimeout(() => setInvincible(false), 2000)
    }

    const isPaused = phase !== 'playing'

    return (
        <>
            <Road gameSpeed={gameSpeed} paused={isPaused} />
            <HUD lives={lives} distance={distance}
                shield={shieldActive} multiplier={multiplierActive} slowmo={slowmoActive} />
            <Player {...playerPos} invincible={invincible || shieldActive} />
            {cars.map(car => (
                <Car key={car.id} id={car.id} y={car.y} w={car.w} h={car.h} speed={car.speed}
                    playerPos={playerPos} playerW={PLAYER_W} playerH={PLAYER_H}
                    onRemove={removeCar} onHit={onHit} paused={isPaused} slowed={slowmoActive} />
            ))}
            {powerups.map(p => (
                <Powerup key={p.id} id={p.id} type={p.type} y={p.y} speed={p.speed}
                    playerPos={playerPos} playerW={PLAYER_W} playerH={PLAYER_H}
                    onCollect={handleCollect} onRemove={removePowerup} paused={isPaused} />
            ))}

            {phase === 'countdown' && (
                <Countdown onComplete={() => setPhase('playing')} />
            )}

            {phase === 'paused' && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 20,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 28,
                    fontFamily: "'Press Start 2P', monospace"
                }}>
                    <h2 style={{ color: '#ffcc00', fontSize: 28, margin: 0, textShadow: '0 0 20px #ffcc00' }}>PAUSED</h2>
                    <button onClick={() => { playSelect(); setPhase('countdown') }} style={btnStyle('#ff2244')}>▶ RESUME</button>
                    <button onClick={() => { playSelect(); onMenu() }} style={btnStyle('#ffffff44')}>QUIT TO MENU</button>
                </div>
            )}
        </>
    )
}

const btnStyle = (color) => ({
    padding: '14px 36px', fontSize: 12,
    fontFamily: "'Press Start 2P', monospace",
    backgroundColor: 'transparent',
    color: 'white', border: `2px solid ${color}`,
    cursor: 'pointer',
})

export default GameScreen
