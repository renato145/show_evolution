import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faCaretLeft, faCaretRight, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'

export const PlayerControl = ({ n, setTime, time, speed }) => {
  const [ play, setPlay ] = useState(false);
  const [ playCb, setPlayCb ] = useState(null)
  const playRef = useRef();
  playRef.current = { n, time, speed, play };
  
  const removeTimeout = () => {
    if ( playCb ) {
      clearTimeout(playCb);
      setPlayCb(null);
    }
  };

  const playFunc = () => {
    const { n, time, speed, play } = playRef.current;
    if ( (time < (n-1)) & play ) {
      setTime(time + 1);
      setPlayCb(setTimeout(playFunc, speed));
    } else {
      setPlay(false);
      removeTimeout();
    }
  };

  const tooglePlay = () => {
    const { speed, play } = playRef.current;
    if ( !play ) {
      setPlay(true);
      setPlayCb(setTimeout(playFunc, speed));
    } else {
      setPlay(false);
      removeTimeout();
    }
  };

  // Playback keys
  useEffect(() => {
    document.addEventListener('keydown', e => {
      if(e.code==='Space'){
        tooglePlay();
      }
    });
  }, [])

  return (
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
};
