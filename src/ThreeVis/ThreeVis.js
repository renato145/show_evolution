import React, { useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { InstancedPoints } from './InstancedPoints';
const THREE = require('three');

// camera settings
const fov = 30;
const near = 1;
const far = 150;
const defaultCameraZoom = 100;

export const ThreeVis = ({ data, selectedPoint, setSelectedPoint, nPoints }) => {
  return (
    <Canvas
      camera={{
        fov: fov,
        near: near,
        far: far+1,
        position: [0, 0, defaultCameraZoom]
      }}
    >
      <InstancedPoints {...{data, selectedPoint, setSelectedPoint, nPoints, fov, near, far, defaultCameraZoom }} />
    </Canvas>
  );
};