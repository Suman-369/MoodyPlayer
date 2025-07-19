import React, { useState, useRef } from 'react'
import "./moodsongs.css"

const MoodSongs = ({Songs}) => {
const [isPlaying , setIsPlaying] = useState(null)
const audioRefs = useRef([])

const handlePlay = (index) => {
    if(isPlaying === index){
        audioRefs.current[index].pause();
        setIsPlaying(null)
    }
    else{
        if (isPlaying !== null && audioRefs.current[isPlaying]) {
            audioRefs.current[isPlaying].pause();
            audioRefs.current[isPlaying].currentTime = 0;
        }
        audioRefs.current[index].play();
        setIsPlaying(index)
    }
}
   
  return (
    <div className='mood-Songs'>
        <h2>Recommended Songs</h2>

            {Songs.map((song,index)=>(
                <div className="song" key={index}>
                    <div className="title">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                    </div>
                    <div className="play-pause-button">
                        <audio
                            ref={el => audioRefs.current[index] = el}
                            src={song.audio}
                            onEnded={() => setIsPlaying(null)}
                            style={{ display: 'none' }}
                        />
                       <button onClick={()=>handlePlay(index)}>
                        {isPlaying === index ? <i className="ri-pause-mini-line"></i> :
                         <i className="ri-play-circle-fill"></i>}
                       </button>
                    
                    </div>
                </div>
            ))}
       

    </div>
  )
}

export default MoodSongs
