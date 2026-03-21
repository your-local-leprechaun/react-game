import { useState, useEffect } from 'react'
import { playGo } from '../sounds.js'

function Countdown({ onComplete }) {
    const [count, setCount] = useState(3)

    useEffect(() => {
        if (count === 0) {
            playGo()
            const t = setTimeout(onComplete, 700)
            return () => clearTimeout(t)
        }
        const t = setTimeout(() => setCount(prev => prev - 1), 1000)
        return () => clearTimeout(t)
    }, [count])

    return (
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, pointerEvents: 'none',
        }}>
            <span key={count} style={{
                fontSize: 80,
                fontFamily: "'Press Start 2P', monospace",
                color: count === 0 ? '#00ff88' : '#ffcc00',
                textShadow: count === 0
                    ? '0 0 30px #00ff88, 0 0 60px #00ff88'
                    : '0 0 30px #ffcc00, 0 0 60px #ffcc00',
                animation: 'popIn 0.2s ease-out',
            }}>
                {count === 0 ? 'GO!' : count}
            </span>
            <style>{`
                @keyframes popIn {
                    from { transform: scale(1.8); opacity: 0; }
                    to   { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </div>
    )
}

export default Countdown
