import { useState } from 'react'
import './App.css'
import FaceExpressionDetector from './components/facialexpresions'
import MoodSongs from './components/songs'

function App() {
  

  return (
    <>
        <FaceExpressionDetector/>
        <MoodSongs/>
    </>
  )
}

export default App
