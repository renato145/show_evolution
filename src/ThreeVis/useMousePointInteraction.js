import { useRef } from "react";

export const useMousePointInteraction = ({ selectedPoint, onSelectPoint }) => {
  // track mousedown position to skip click handlers on drags
  const mouseDownRef = useRef([0, 0]);
  const handlePointerDown = e => {
    mouseDownRef.current[0] = e.clientX;
    mouseDownRef.current[1] = e.clientY;
  };

  const handleClick = event => {
    const { instanceId: index, clientX, clientY } = event;
    const downDistance = Math.sqrt(
      Math.pow(mouseDownRef.current[0] - clientX, 2) +
        Math.pow(mouseDownRef.current[1] - clientY, 2)
    );

    // skip click if we dragged more than 5px distance
    if (downDistance > 5) {
      event.stopPropagation();
      return;
    }

    // toggle the point
    if (selectedPoint !== null) {
      if ( selectedPoint === index ){
        onSelectPoint(null);
      } else {
        onSelectPoint(index);
      }
    } else {
      onSelectPoint(index);
    }
  };

  return { handlePointerDown, handleClick };
};
