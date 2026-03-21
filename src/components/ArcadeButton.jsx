import { useState } from 'react'

function ArcadeButton({ onClick, disabled, style, children }) {
    const [hovered, setHovered] = useState(false)

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...style,
                transform: hovered && !disabled ? 'scale(1.05)' : 'scale(1)',
                filter: hovered && !disabled ? 'brightness(1.4)' : 'brightness(1)',
                transition: 'transform 0.08s, filter 0.08s, box-shadow 0.08s',
                boxShadow: hovered && !disabled
                    ? `${style.boxShadow || ''}, 0 0 20px currentColor`.trim()
                    : style.boxShadow || 'none',
            }}
        >
            {children}
        </button>
    )
}

export default ArcadeButton
