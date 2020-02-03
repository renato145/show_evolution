import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring/three';
import { useD3Controls } from './useD3Controls';
const THREE = require('three');

// canvas settings
const backgroundColor = new THREE.Color(0xefefef);

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

const updateInstancedMeshMatrices = ({ mesh, points, colors, colorAttrib, colorArray }) => {
  if (!mesh) return;

  [...Array(points.length/3)].fill(0).forEach((d,i) => {
    const position = points.slice(i*3,(i+1)*3);
    scratchObject3D.position.set(...position);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  });

  colors.forEach((d,i) => colorArray[i] = d);
  colorAttrib.needsUpdate = true;
  mesh.instanceMatrix.needsUpdate = true;
};

const useAnimatedLayout = ({ points, colors, onFrame }) => {
  useSpring({
    points: points,
    colors: colors,
    onFrame: ({ points, colors }) => {
      onFrame({ points, colors});
    },
  });
};

export const InstancedPoints = ({
  data, selectedPoint, setSelectedPoint, nPoints, fov, near, far, defaultCameraZoom
}) => {
  const meshRef = useRef();
  const colorRef = useRef();
  const { scene } = useThree();
  const { points, colors, pointsData } = data;
  const colorArray = useMemo(() => new Float32Array(nPoints*3), [ nPoints ]);

  // d3 controls (zoom and pan)
  useD3Controls({ fov, near, far, defaultCameraZoom });

  useEffect(() => {
    if ( scene )
      scene.background = backgroundColor;
  }, [ scene ]);

  // Animating on change
  useAnimatedLayout({
    points,
    colors,
    onFrame: ({ points, colors }) => {
      updateInstancedMeshMatrices({ mesh: meshRef.current, points, colors, colorAttrib: colorRef.current, colorArray });
    },
  });

  const handleClick = () => console.log('click');
  const handlePointerDown = () => console.log('pointer down');

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, nPoints]}
      frustumCulled={false}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <sphereBufferGeometry attach='geometry' args={[0.5, 0.5, 0.15, 32]}>
        <instancedBufferAttribute
          ref={colorRef}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </sphereBufferGeometry>
      <meshBasicMaterial
        attach='material'
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  );
};