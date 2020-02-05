import React, { useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faCaretLeft, faCaretRight, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'

export const usePlayerControl = ({ n, setTime, time, speed }) => {
  const [ play, setPlay ] = useState(false);
  const [, setPlayCb ] = useState(null)
  const playRef = useRef();
  playRef.current = { n, time, speed, play };
  
  const removeTimeout = useCallback(() => {
    setPlayCb(playCb => {
      if ( playCb ) {
        clearTimeout(playCb);
        return null;
      }
    });
  }, []);

  const playFunc = useCallback(() => {
    const { n, time, speed, play } = playRef.current;
    if ( (time < (n-1)) & play ) {
      setTime(time + 1);
      setPlayCb(setTimeout(playFunc, speed));
    } else {
      setPlay(false);
      removeTimeout();
    }
  }, [ removeTimeout, setTime ]);

  const stopPlay = useCallback(() => {
    setPlay(false);
    removeTimeout();
  }, [ removeTimeout ])

  const tooglePlay = useCallback(() => {
    const { speed, play } = playRef.current;
    if ( !play ) {
      setPlay(true);
      setPlayCb(setTimeout(playFunc, speed));
    } else {
      setPlay(false);
      removeTimeout();
    }
  }, [ playFunc, removeTimeout ]);

  const PlayerControl =  (
    <div className='controllers row justify-content-center'>
      <div className='button-container'>
        <button
          type='button'
          className='btn btn-default'
          onClick={() => setTime(0)}
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button
          type='button'
          className='btn btn-default'
          onClick={() => setTime(d => Math.max(d-1, 0) )}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
        <button
          type='button'
          className='btn btn-default'
          onClick={tooglePlay}
        >
          <FontAwesomeIcon icon={play ? faPause : faPlay} />
        </button>
        <button
          type='button'
          className='btn btn-default'
          onClick={() => setTime(d => Math.min(d+1, n-1) )}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
        <button
          type='button'
          className='btn btn-default'
          onClick={() => setTime(n-1)}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
      </div>
    </div>
  );

  return { PlayerControl, stopPlay, tooglePlay };
};
