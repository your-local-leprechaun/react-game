import './Player.css'

function Player({ x, y, invincible }) {
    return (
        <div className={`player${invincible ? ' invincible' : ''}`} style={{ left: x, top: y }} />
    )
}

export default Player
