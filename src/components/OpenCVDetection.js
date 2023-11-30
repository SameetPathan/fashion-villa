import React, { useEffect } from 'react';
import cv from 'opencv.js';

const FaceDetectionComponent = () => {
  useEffect(() => {
    const loadOpenCV = async () => {
      cv.onRuntimeInitialized = () => {
        const classifier = new cv.CascadeClassifier();
        classifier.load('haarcascade_frontalface_default.xml');

        const imgElement = document.createElement('img');
        imgElement.src = 'shirt.png'; 
        imgElement.onload = () => {
          const mat = cv.imread(imgElement);

          const grayMat = new cv.Mat();
          cv.cvtColor(mat, grayMat, cv.COLOR_RGBA2GRAY, 0);

          const faces = new cv.RectVector();
          const minSize = new cv.Size(50, 50); 
          classifier.detectMultiScale(grayMat, faces, 1.1, 3, 0, minSize);

          for (let i = 0; i < faces.size(); ++i) {
            const faceRect = faces.get(i);
            const point1 = new cv.Point(faceRect.x, faceRect.y);
            const point2 = new cv.Point(faceRect.x + faceRect.width, faceRect.y + faceRect.height);
            cv.rectangle(mat, point1, point2, [255, 0, 0, 255]); 
          }


          const canvas = document.createElement('canvas');
          document.body.appendChild(canvas);
          cv.imshow(canvas, mat);

        
          mat.delete();
          grayMat.delete();
          faces.delete();
          classifier.delete();
        };
      };
    };

    loadOpenCV();
  }, []);

  return (
    <div>
      <h1>Face Detection</h1>
    </div>
  );
};

export default FaceDetectionComponent;
