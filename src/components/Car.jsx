import { useState, useEffect, useRef } from 'react'

const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`

function isColliding(player, playerW, playerH, car) {
    return (
        player.x < car.x + car.w &&
        player.x + playerW > car.x &&
        player.y < car.y + car.h &&
        player.y + playerH > car.y
    )
}

function Car({ id, y, w, h, speed, playerPos, playerW, playerH, onRemove, onHit, paused, slowed }) {
    const [x, setX] = useState(window.innerWidth)
    const [color] = useState(randomColor())
    const playerPosRef = useRef(playerPos)
    const pausedRef = useRef(paused)
    const slowedRef = useRef(slowed)

    useEffect(() => {
        playerPosRef.current = playerPos
    }, [playerPos])

    useEffect(() => {
        pausedRef.current = paused
    }, [paused])

    useEffect(() => {
        slowedRef.current = slowed
    }, [slowed])

    useEffect(() => {
        const loop = setInterval(() => {
            if (pausedRef.current) return
            setX(prev => {
                const next = prev - speed * (slowedRef.current ? 0.4 : 1)
                if (next + w < 0) {
                    onRemove(id)
                    return prev
                }
                if (isColliding(playerPosRef.current, playerW, playerH, { x: next, y, w, h })) {
                    onHit()
                }
                return next
            })
        }, 16)
        return () => clearInterval(loop)
    }, [])

    return (
        <div style={{ backgroundColor: color, width: w, height: h, left: x, top: y, position: 'fixed' }} />
    )
}

export default Car
