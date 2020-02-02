import React, { useRef, useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import { useD3Controls } from './useD3Controls';
const THREE = require('three');

// canvas settings
const backgroundColor = new THREE.Color(0xefefef);

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

const updateInstancedMeshMatrices = ({ mesh, points }) => {
  if (!mesh) return;

  points.forEach((d,i) => {
    scratchObject3D.position.set(...d);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
};

export const InstancedPoints = ({
  data, selectedPoint, setSelectedPoint, nPoints, fov, near, far, defaultCameraZoom
}) => {
  const meshRef = useRef();
  const { scene } = useThree();
  const { points, colors, pointsData, thisTime } = data;

  // d3 controls (zoom and pan)
  useD3Controls({ fov, near, far, defaultCameraZoom });

  useEffect(() => {
    if ( scene )
      scene.background = backgroundColor;
  }, [ scene ]);

  // run the layout, animating on change
  // const { animationProgress } = useAnimatedLayout({
  //   data,
  //   layout,
  //   onFrame: () => {
  //     updateInstancedMeshMatrices({ mesh: meshRef.current, data });
  //   },
  // });

  // update instance matrices only when needed
  useEffect(() => {
    updateInstancedMeshMatrices({ mesh: meshRef.current, points });
  }, [ points ]);

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
      <sphereBufferGeometry attach="geometry" args={[0.5, 0.5, 0.15, 32]}>
        <instancedBufferAttribute
          ref={colorAttrib}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </sphereBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  );
};