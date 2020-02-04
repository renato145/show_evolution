const THREE = require('three');

export const getClientPosition = (point, size, camera) => {
  const clientPosition = new THREE.Vector3(...point);
  clientPosition.project(camera).addScalar(1).divideScalar(2);
  clientPosition.x *= size.width;
  clientPosition.y *= size.height;
  return clientPosition;
};

export const getCanvasPosition = (clientPosition, size, camera) => {
  clientPosition.x /= size.width;
  clientPosition.y /= size.height;
  clientPosition.multiplyScalar(2).subScalar(1).unproject(camera);
  return [clientPosition.x, clientPosition.y, 0];
};
