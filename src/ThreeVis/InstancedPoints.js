import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useThree, Dom } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import { useD3Controls } from './useD3Controls';
import { useMousePointInteraction } from './useMousePointInteraction';
import { getClientPosition, getCanvasPosition } from './utils';
const THREE = require('three');

// canvas settings
const backgroundColor = new THREE.Color(0xefefef);

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

const updateInstancedMeshMatrices = ({ sphereSize, aspect, mesh, points, colors, colorAttrib, colorArray }) => {
  if (!mesh) return;

  [...Array(points.length/3)].fill(0).forEach((d,i) => {
    const [ x, y, z ] = points.slice(i*3,(i+1)*3);
    scratchObject3D.position.set(x*aspect, y, z);
    scratchObject3D.scale.setScalar(sphereSize);
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
  data, sphereSize, nPoints, fov, near, far, defaultCameraZoom, speed
}) => {
  const meshRef = useRef();
  const colorRef = useRef();
  const hoverRef = useRef();
  const { scene, aspect, size, camera } = useThree();
  const { points, colors, pointsData } = data;
  const colorArray = useMemo(() => new Float32Array(nPoints*3), [ nPoints ]);
  const [ selectedPoint, setSelectedPoint ] = useState(null);

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
      {selectedPoint !== null && (
        <a.group
          position={pointsAnim.interpolate((...d) => {
            const margin = 10;
            const point = d.slice(selectedPoint*3, (selectedPoint+1)*3).map((o,i) => i%3===0 ? o*aspect : o);
            const clientPosition = getClientPosition(point, size, camera);
            clientPosition.y -= margin;
            if ( hoverRef.current ) {
              const { clientHeight, clientWidth } = hoverRef.current;
              const position = {
                left: clientPosition.x - clientWidth/2,
                right: clientPosition.x + clientWidth/2,
                top: clientPosition.y,
                bottom: clientPosition.y - clientHeight,
              };
              if ( position.left < 0 ) {
                clientPosition.x -= position.left;
              } else if ( position.right > size.width ) {
                clientPosition.x -= position.right - size.width;
              }
              if ( position.bottom < 0 ) {
                clientPosition.y += 2*margin + clientHeight;
              }
            }

            return getCanvasPosition(clientPosition, size, camera);

          })}
        >
          <Dom
            center={true}
            style={{transform: 'translate3d(-50%, 0, 0)'}}
            ref={hoverRef}
          >
            <div className='hover-description'>
              { pointsData[selectedPoint] }
            </div>
          </Dom>
        </a.group>
      )}
    </>
  );
};
