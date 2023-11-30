import React, { useState, useEffect } from 'react';
import {
  faExclamationCircle,
  faShoppingCart,
  faSearch,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CameraComponent = (props) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userMediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: Stop the camera when the component is unmounted
      stopCamera();
    };
  }, []);

  return (
    <div>
      
        {isCameraOn ?  <FontAwesomeIcon onClick={isCameraOn ? stopCamera : startCamera}  title="Try it on" className="mr-1 ml-3" icon={faEye} /> :  <FontAwesomeIcon onClick={isCameraOn ? stopCamera : startCamera}  title="Try it on"  className="mr-1 ml-3" icon={faEye} />}
      

      {isCameraOn && (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '45%' }}>

          <video
            autoPlay
            playsInline
            ref={(videoRef) => videoRef && (videoRef.srcObject = stream)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />

       
          <img
            src={props.imgsrc}
            alt="Overlay"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '80%',
              maxHeight: '80%',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
