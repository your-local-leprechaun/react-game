import { useState, useRef, useEffect } from 'react'
import { submitScore } from '../firebase.js'
import { playSelect } from '../sounds.js'

function GameOverScreen({ distance, onPlay, onMenu, onScoreboard }) {
    const [letters, setLetters] = useState(['', '', ''])
    const [submitting, setSubmitting] = useState(false)
    const inputs = [useRef(), useRef(), useRef()]

    useEffect(() => {
        inputs[0].current.focus()
    }, [])

    const handleChange = (i, val) => {
        const char = val.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase()
        const next = [...letters]
        next[i] = char
        setLetters(next)
        if (char && i < 2) inputs[i + 1].current.focus()
    }

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !letters[i] && i > 0) {
            inputs[i - 1].current.focus()
        }
        if (e.key === 'Enter') handleSubmit()
    }

    const name = letters.join('')
    const canSubmit = name.length === 3 && !submitting

    const handleSubmit = async () => {
        if (!canSubmit) return
        playSelect()
        setSubmitting(true)
        await submitScore(name, distance)
        onScoreboard()
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: '#0a0a0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 32, color: 'white',
        }}>
            <h1 style={{ fontSize: 32, color: '#ff2244', textShadow: '0 0 20px #ff2244' }}>
                GAME OVER
            </h1>

            <p style={{ fontSize: 11, color: '#ffcc00' }}>
                {distance}M
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <p style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.5)' }}>
                    ENTER YOUR NAME
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                    {letters.map((l, i) => (
                        <input
                            key={i}
                            ref={inputs[i]}
                            value={l}
                            onChange={e => handleChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            onFocus={e => e.target.select()}
                            maxLength={1}
                            style={{
                                width: 64, height: 80,
                                fontSize: 36, fontWeight: 'bold',
                                fontFamily: "'Press Start 2P', monospace",
                                textAlign: 'center',
                                backgroundColor: '#0a0a0a',
                                border: `3px solid ${l ? '#ffcc00' : '#444'}`,
                                color: '#ffcc00',
                                outline: 'none', caretColor: 'transparent',
                                boxShadow: l ? '0 0 10px #ffcc0066' : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit} style={{
                ...btnStyle('#ff2244'),
                opacity: canSubmit ? 1 : 0.3,
                cursor: canSubmit ? 'pointer' : 'default',
            }}>
                {submitting ? '...' : 'SUBMIT'}
            </button>

            <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={() => { playSelect(); onPlay() }} style={btnStyle('#ffffff33')}>PLAY AGAIN</button>
                <button onClick={() => { playSelect(); onMenu() }} style={btnStyle('#ffffff33')}>MENU</button>
            </div>
        </div>
    )
}

const btnStyle = (color) => ({
    padding: '14px 28px', fontSize: 11,
    fontFamily: "'Press Start 2P', monospace",
    backgroundColor: 'transparent',
    color: 'white', border: `2px solid ${color}`,
    cursor: 'pointer',
})

export default GameOverScreen
