import { useState, useEffect } from 'react'
import { getTopScores } from '../firebase.js'
import { playSelect } from '../sounds.js'

function ScoreboardScreen({ onMenu }) {
    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getTopScores()
            .then(setScores)
            .catch(() => setError('LOAD FAILED'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: '#0a0a0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 28, color: 'white',
        }}>
            <h1 style={{ fontSize: 24, color: '#00ccff', textShadow: '0 0 20px #00ccff' }}>
                HIGH SCORES
            </h1>

            <div style={{ width: 380 }}>
                {loading && <p style={{ textAlign: 'center', fontSize: 10, opacity: 0.4 }}>LOADING...</p>}
                {error   && <p style={{ textAlign: 'center', fontSize: 10, color: '#ff2244' }}>{error}</p>}

                {Array.from({ length: 10 }).map((_, i) => {
                    const s = scores[i]
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 0', borderBottom: '1px solid #222',
                            fontSize: 11, opacity: s ? 1 : 0.2,
                        }}>
                            <span style={{ color: i < 3 ? '#ffcc00' : 'rgba(255,255,255,0.5)', width: 28 }}>
                                {i + 1}.
                            </span>
                            <span style={{ flex: 1, letterSpacing: 4 }}>{s ? s.name : '---'}</span>
                            <span style={{ color: '#ffcc00' }}>{s ? `${s.distance}M` : '---'}</span>
                        </div>
                    )
                })}
            </div>

            <button onClick={() => { playSelect(); onMenu() }} style={{
                padding: '14px 32px', fontSize: 11,
                fontFamily: "'Press Start 2P', monospace",
                backgroundColor: 'transparent',
                color: 'white', border: '2px solid #444',
                cursor: 'pointer',
            }}>
                ← BACK
            </button>
        </div>
    )
}

export default ScoreboardScreen
