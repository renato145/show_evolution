import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { InstancedPoints } from './InstancedPoints';

// camera settings
const fov = 30;
const near = 5;
const far = 150;
const defaultCameraZoom = 100;

export const ThreeVis = ({ data, sphereSize, nPoints, speed }) => {
  const [ selectedPoint, setSelectedPoint ] = useState({ show: false, index: 0});

  return (
    <Canvas
      camera={{
        fov: fov,
        near: 0.1,
        far: far+1,
        position: [0, 0, defaultCameraZoom]
      }}
      onPointerMissed={() => setSelectedPoint({ show:false, index: 0})}
    >
      <InstancedPoints
        {...{data, sphereSize, nPoints, fov, near, far, defaultCameraZoom, speed, selectedPoint, setSelectedPoint}}
      />
    </Canvas>
  );
};