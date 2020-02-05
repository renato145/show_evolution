import React, { useRef } from 'react';
import { useThree, Dom } from 'react-three-fiber';
import { a } from 'react-spring/three';
import { getClientPosition, getCanvasPosition } from './utils';

const margin = 10;

export const HoverDialog = ({ pointsAnim, selectedPoint, pointsData }) => {
  const hoverRef = useRef();
  const { size, camera, aspect } = useThree();
  const { show, index } = selectedPoint;

  return (
    <a.group
      position={pointsAnim.interpolate((...d) => {
        const point = d.slice(index*3, (index+1)*3).map((o,i) => i%3===0 ? o*aspect : o);
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
        style={{
          transform: `translate3d(-50%, ${ show ? 0 : '1000%' }, 0)`, // Dirty trick to hide the dialog outside of canvas view
        }}
        ref={hoverRef}
      >
        <div className='hover-description'>
          { pointsData[index] }
        </div>
      </Dom>
    </a.group>
  );
};