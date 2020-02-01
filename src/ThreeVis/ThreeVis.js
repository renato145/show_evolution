import React, { useEffect } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { InstancedPoints } from './InstancedPoints';
const THREE = require('three');

// canvas settings
const backgroundColor = new THREE.Color(0xefefef);

// camera settings
const fov = 30;
const near = 1;
const far = 150;
const defaultCameraZoom = 100;

export const ThreeVis = () => {
  const { scene } = useThree();

  useEffect(() => {
    if ( scene )
      scene.background = backgroundColor;
  }, [ scene ]);

  return (
    <Canvas
      camera={{
        fov: fov,
        near: near,
        far: far+1,
        position: [0, 0, defaultCameraZoom]
      }}
    >
      <InstancedPoints />
    </Canvas>
  );
};