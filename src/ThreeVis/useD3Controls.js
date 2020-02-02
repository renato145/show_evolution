// From https://observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization
import { zoom, event, select, zoomIdentity } from 'd3';
import { useThree } from 'react-three-fiber';

const toRadians = angle => (angle * (Math.PI/180));

export const useD3Controls = ({ fov, near, far, defaultCameraZoom }) => {
  const { gl, camera, size } = useThree();
  const { width, height } = size;

  const zoomHandler = ({ x, y, k }) => {
    camera.position.set(
      -(x -  width/2) / k, // x
       (y - height/2) / k, // y
       getZFromScale(k)    // z
    )
  };

  const getScaleFromZ = z => ( height / (2 * z * Math.tan(toRadians(fov/2))) );
  const getZFromScale = scale => ( height / scale / (2 * Math.tan(toRadians(fov/2))) );

  const threeZoom = zoom()
    .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
    .on('zoom', () => {
      zoomHandler(event.transform);
    });
  
  // Add zoom listener
  const view = select(gl.domElement);
  view.call(threeZoom);
  const initialScale = getScaleFromZ(defaultCameraZoom);
  const initialTransform = zoomIdentity
    .translate(width/2, height/2)
    .scale(initialScale);    
  threeZoom.transform(view, initialTransform);
  camera.position.set(0, 0, defaultCameraZoom);

  // Double click resets camera
  view.on('dblclick.zoom', () => {
    threeZoom.transform(view, initialTransform);
    camera.position.set(0, 0, defaultCameraZoom);
  });
};
