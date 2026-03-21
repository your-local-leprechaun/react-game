import { useState } from 'react'
import Player from './components/Player.jsx'

function App() {
  const [count, setCount] = useState(0)

  return(
    <>
      <Player />
    </>
  )
}

export default App
