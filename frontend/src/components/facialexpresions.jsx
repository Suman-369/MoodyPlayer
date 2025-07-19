import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import "./facial.css"
import axios from 'axios';

const FaceExpressionDetector = ({setSongs}) => {
  const videoRef = useRef();

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // place models in public/models folder
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    loadModels();
  }, []);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  // Detect expressions
 


  async function detectmood(){
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
        let mostProableExpression = 0 
        let _expressions = ''

        if(!detections || detections.length === 0) {
          console.log('No face detected')
          return
        }

       for(const expressions of Object.keys(detections[0].expressions)){
        if(detections[0].expressions[expressions] > mostProableExpression){
          mostProableExpression = detections[0].expressions[expressions]
          _expressions = expressions
        }
       }
       console.log(_expressions);

       axios.get(`http://localhost:3000/songs?mood=${_expressions}`)
        .then(response=>{
          console.log(response.data)
          setSongs(response.data.songs)
        })
      }
  }

  return (
    <div className='mood-element'>
      <video
        ref={videoRef}
        autoPlay
        muted   
        className='user-video-feed'
      />
      <button onClick={detectmood}>Detect Mood</button>
    </div>
  );
};

export default FaceExpressionDetector;
