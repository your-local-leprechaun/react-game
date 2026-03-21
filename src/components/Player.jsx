import { useState, useEffect } from 'react'
import './Player.css'

const SPEED = 10
const PLAYER_W = 50
const PLAYER_H = 25

function Player() {
    const [pos, setPos] = useState({ x: 100, y: 100 })

    useEffect(() => {
        const keys = {}

        const handleKeyDown = (e) => { keys[e.key] = true }
        const handleKeyUp = (e) => { keys[e.key] = false }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        console.log(windowHeight, windowWidth)

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        const loop = setInterval(() => {
            setPos(prev => {
                let { x, y } = prev
                let dx = 0, dy = 0

                if (keys['ArrowUp'] || keys['w'])    dy -= 1
                if (keys['ArrowDown'] || keys['s'])  dy += 1
                if (keys['ArrowLeft'] || keys['a'])  dx -= 1
                if (keys['ArrowRight'] || keys['d']) dx += 1

                const len = Math.sqrt(dx * dx + dy * dy)
                if (len > 0) {
                    x += (dx / len) * SPEED
                    y += (dy / len) * SPEED
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

    return (
        <div className="player" style={{ left: pos.x, top: pos.y }} />
    )
}

export default Player
