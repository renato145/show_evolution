import React, { useRef } from 'react';

export const InstancedPoints = () => {
  const meshRef = useRef();

  return (
    <instancedMesh
      ref={meshRef}
    >
    </instancedMesh>
  );
};