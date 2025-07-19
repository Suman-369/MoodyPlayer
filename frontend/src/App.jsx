import { useState } from 'react'
import './App.css'
import FaceExpressionDetector from './components/facialexpresions'
import MoodSongs from './components/songs'

function App() {
  const [Songs,setSongs] = useState([
  
])

  return (
    <>
        <FaceExpressionDetector setSongs={setSongs}/>
        <MoodSongs Songs={Songs} />
    </>
  )
}

export default App
