import { useState, useEffect, useRef } from 'react'

export const POWERUP_TYPES = {
    life:       { emoji: '❤️',  color: '#e74c3c', label: 'Extra Life' },
    multiplier: { emoji: '✨',  color: '#f1c40f', label: '2× Score'   },
    shield:     { emoji: '🛡️', color: '#3498db', label: 'Shield'      },
    slowmo:     { emoji: '🐌',  color: '#9b59b6', label: 'Slow Mo'     },
}

const SIZE = 42

function isColliding(player, playerW, playerH, obj) {
    return (
        player.x < obj.x + obj.w &&
        player.x + playerW > obj.x &&
        player.y < obj.y + obj.h &&
        player.y + playerH > obj.y
    )
}

function Powerup({ id, type, y, speed, playerPos, playerW, playerH, onCollect, onRemove, paused }) {
    const [x, setX] = useState(window.innerWidth)
    const playerPosRef = useRef(playerPos)
    const pausedRef = useRef(paused)

    useEffect(() => { playerPosRef.current = playerPos }, [playerPos])
    useEffect(() => { pausedRef.current = paused }, [paused])

    useEffect(() => {
        const loop = setInterval(() => {
            if (pausedRef.current) return
            setX(prev => {
                const next = prev - speed
                if (next + SIZE < 0) {
                    onRemove(id)
                    return prev
                }
                if (isColliding(playerPosRef.current, playerW, playerH, { x: next, y, w: SIZE, h: SIZE })) {
                    onCollect(id, type)
                    return prev
                }
                return next
            })
        }, 16)
        return () => clearInterval(loop)
    }, [])

    const { emoji, color } = POWERUP_TYPES[type]

    return (
        <div style={{
            position: 'fixed',
            left: x, top: y,
            width: SIZE, height: SIZE,
            backgroundColor: color,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            boxShadow: `0 0 14px ${color}, 0 0 28px ${color}44`,
            zIndex: 5,
            userSelect: 'none'
        }}>
            {emoji}
        </div>
    )
}

export default Powerup
