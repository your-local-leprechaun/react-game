function HUD({ lives, distance, shield, multiplier, slowmo }) {
    const effects = [
        shield     && { emoji: '🛡️', color: '#3498db' },
        multiplier && { emoji: '✨',  color: '#ffcc00' },
        slowmo     && { emoji: '🐌',  color: '#9b59b6' },
    ].filter(Boolean)

    return (
        <div style={{
            position: 'fixed', top: 16, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 20px', zIndex: 10, pointerEvents: 'none',
            fontFamily: "'Press Start 2P', monospace",
        }}>
            <div style={{ fontSize: 18 }}>
                {Array.from({ length: lives }).map((_, i) => (
                    <span key={i} style={{ marginRight: 4 }}>❤️</span>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                {effects.map((e, i) => (
                    <span key={i} style={{ fontSize: 18, filter: `drop-shadow(0 0 6px ${e.color})` }}>
                        {e.emoji}
                    </span>
                ))}
            </div>

            <div style={{ fontSize: 11, color: multiplier ? '#ffcc00' : 'white', textShadow: multiplier ? '0 0 10px #ffcc00' : 'none' }}>
                {multiplier && <span style={{ fontSize: 9, marginRight: 6, opacity: 0.8 }}>2×</span>}
                {Math.floor(distance)}M
            </div>
        </div>
    )
}

export default HUD
