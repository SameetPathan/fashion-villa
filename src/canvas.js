import React, { useRef, useEffect } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    // Access the user's camera
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Error accessing the camera:', err));

    return () => {
      // Stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <img
        ref={imageRef}
        src="reddress.png"
        alt="Overlay Image"
        style={{
          position: 'absolute',
          top: '80%', // Move the image to the center vertically
          left: '50%', // Move the image to the center horizontally
          transform: 'translate(-50%, -50%)', // Center the image precisely
          width: '45%',
          height: '80%',
          maxWidth: '100%', // Ensure image doesn't exceed video width
          maxHeight: '100%', // Ensure image doesn't exceed video height
        }}
      />
    </div>
  );
};

export default CameraComponent;
