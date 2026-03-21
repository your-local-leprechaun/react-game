import { playSelect } from '../sounds.js'
import ArcadeButton from '../components/ArcadeButton.jsx'

function MenuScreen({ onPlay, onScoreboard }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: '#0a0a0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 36, color: 'white',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <h1 style={{
                    fontSize: 52, margin: 0, color: '#ff2244',
                    textShadow: '0 0 10px #ff2244, 0 0 30px #ff2244, 0 0 60px #ff2244, 0 0 100px #ff224488',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                }}>
                    RACER
                </h1>
                <p style={{
                    fontSize: 9, letterSpacing: 3,
                    color: 'rgba(255,255,255,0.5)',
                    textShadow: '0 0 8px rgba(255,255,255,0.3)',
                }}>
                    SURVIVE AS LONG AS YOU CAN
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
                <ArcadeButton onClick={() => { playSelect(); onPlay() }} style={btnStyle('#ff2244')}>▶ PLAY</ArcadeButton>
                <ArcadeButton onClick={() => { playSelect(); onScoreboard() }} style={btnStyle('#00ccff')}>SCOREBOARD</ArcadeButton>
            </div>

            <p style={{
                fontSize: 9, color: 'rgba(255,255,255,0.4)',
                textShadow: '0 0 8px rgba(255,255,255,0.3)',
                animation: 'blink 1.2s step-end infinite',
            }}>
                INSERT COIN
            </p>
        </div>
    )
}

const btnStyle = (color) => ({
    padding: '18px 48px',
    fontSize: 13,
    fontFamily: "'Press Start 2P', monospace",
    backgroundColor: 'transparent',
    color: color,
    border: `3px solid ${color}`,
    cursor: 'pointer',
    boxShadow: `0 0 12px ${color}, 0 0 24px ${color}66, inset 0 0 12px ${color}22`,
    textShadow: `0 0 10px ${color}`,
})

export default MenuScreen
