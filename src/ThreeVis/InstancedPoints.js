import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring/three';
import { useD3Controls } from './useD3Controls';
import { useMousePointInteraction } from './useMousePointInteraction';
import { HoverDialog } from './HoverDialog';
const THREE = require('three');

// settings
const backgroundColor = new THREE.Color(0xefefef);
const selectedPointSize = 2;

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

const updateInstancedMeshMatrices = ({
  sphereSize, aspect, mesh, points, colors, colorAttrib, colorArray, selectedPoint
}) => {
  if (!mesh) return;
  const { show, index } = selectedPoint;
  const selectedSize = show ? sphereSize*selectedPointSize : sphereSize;

  [...Array(points.length/3)].fill(0).forEach((d,i) => {
    const [ x, y, z ] = points.slice(i*3,(i+1)*3);
    scratchObject3D.position.set(x*aspect, y, z);
    scratchObject3D.scale.setScalar(i === index ? selectedSize : sphereSize);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  });

  colors.forEach((d,i) => colorArray[i] = d);
  colorAttrib.needsUpdate = true;
  mesh.instanceMatrix.needsUpdate = true;
};

const useAnimatedLayout = ({ points, colors, speed, onFrame }) => {
  const animProps = useSpring({
    points: points,
    colors: colors,
    onFrame: ({ points, colors }) => {
      onFrame({ points, colors});
    },
    config: { duration: speed }
  });

  return animProps;
};

export const InstancedPoints = ({
  data, sphereSize, nPoints, fov, near, far, defaultCameraZoom, speed, selectedPoint, setSelectedPoint
}) => {
  const meshRef = useRef();
  const colorRef = useRef();
  const { scene, aspect } = useThree();
  const { points, colors, pointsData } = data;
  const colorArray = useMemo(() => new Float32Array(nPoints*3), [ nPoints ]);

  // d3 controls (zoom and pan)
  useD3Controls({ fov, near, far, defaultCameraZoom });

  useEffect(() => {
    if ( scene )
      scene.background = backgroundColor;
  }, [ scene ]);

  // Animating on change
  const { points: pointsAnim } = useAnimatedLayout({
    points,
    colors,
    speed,
    onFrame: ({ points, colors }) => {
      updateInstancedMeshMatrices({
        sphereSize,
        aspect,
        mesh: meshRef.current,
        points,
        colors,
        colorAttrib: colorRef.current,
        colorArray,
        selectedPoint,
      });
    },
  });

  const { handleClick, handlePointerDown } = useMousePointInteraction({
    selectedPoint,
    onSelectPoint: setSelectedPoint
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[null, null, nPoints]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      >
        <sphereBufferGeometry attach='geometry' args={[0.5, 8, 16]} >
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
      <HoverDialog {...{pointsAnim, selectedPoint, pointsData}} />
    </>
  );
};
