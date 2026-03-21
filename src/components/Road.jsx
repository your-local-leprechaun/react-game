import { useState, useEffect, useRef } from 'react'

const LANES = [
    { pos: 0.2, phase: 0 },
    { pos: 0.4, phase: 55 },
    { pos: 0.6, phase: 110 },
    { pos: 0.8, phase: 165 },
]

function Road({ gameSpeed, paused }) {
    const [offset, setOffset] = useState(0)
    const [speedLines, setSpeedLines] = useState([])
    const gameSpeedRef = useRef(gameSpeed)
    const pausedRef = useRef(paused)

    useEffect(() => {
        gameSpeedRef.current = gameSpeed
    }, [gameSpeed])

    useEffect(() => {
        pausedRef.current = paused
    }, [paused])

    // Scroll lane markers
    useEffect(() => {
        const loop = setInterval(() => {
            if (pausedRef.current) return
            setOffset(prev => (prev + gameSpeedRef.current * 1.5) % 22000)
        }, 16)
        return () => clearInterval(loop)
    }, [])

    // Speed lines — spawn + move
    useEffect(() => {
        const loop = setInterval(() => {
            if (pausedRef.current) return
            const speed = gameSpeedRef.current

            setSpeedLines(prev => {
                // Move existing lines left, remove off-screen
                const moved = prev
                    .map(l => ({ ...l, x: l.x - l.speed }))
                    .filter(l => l.x + l.w > 0)

                // Spawn a single line occasionally, more often at higher speeds
                const newLines = Math.random() < speed / 80 ? [{
                    id: Math.random(),
                    x: window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    w: Math.random() * 80 + 40,
                    speed: speed * 2 + Math.random() * speed,
                    opacity: Math.random() * 0.15 + 0.05
                }] : []

                return [...moved, ...newLines]
            })
        }, 16)
        return () => clearInterval(loop)
    }, [])

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#2a2a2a', zIndex: -1 }}>
            {/* Speed lines */}
            {speedLines.map(l => (
                <div key={l.id} style={{
                    position: 'absolute',
                    left: l.x,
                    top: l.y,
                    width: l.w,
                    height: 2,
                    backgroundColor: `rgba(255,255,255,${l.opacity})`,
                    borderRadius: 2
                }} />
            ))}

            {/* Lane dividers */}
            {LANES.map((lane, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${lane.pos * 100}%`,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 60px, transparent 60px, transparent 220px)',
                    backgroundPositionX: `-${offset + lane.phase}px`
                }} />
            ))}
        </div>
    )
}

export default Road
