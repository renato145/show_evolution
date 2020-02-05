import { useEffect } from "react";

export const useKeyEvents = ({
  playerFuncs: { tooglePlay },
  setTime, n, setSpeed, speedStep, minSpeed, maxSpeed
}) => {
  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'BODY') {
        switch (e.code) {
          case 'Space':
            tooglePlay();
            break;
        
          case 'ArrowLeft':
            setTime(d => Math.max(d-1, 0) );
            break;

          case 'ArrowRight':
            setTime(d => Math.min(d+1, n-1) );
            break;

          case 'ArrowUp':
            setSpeed(d => Math.min(d+speedStep, maxSpeed))
            break;

          case 'ArrowDown':
            setSpeed(d => Math.max(d-speedStep, minSpeed))
            break;

          default:
            console.log(e.code);
            break;
        }
      }
    });
  }, [ tooglePlay, setTime, n ]);
};
