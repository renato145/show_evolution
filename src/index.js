import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useEAData } from './useEAData';
import { ProgressBar, GeneralSlider } from './sliders';
import { FileUpload } from './FileUpload';
import './index.css';
import { usePlayerControl } from './usePlayerControl';
import { useKeyEvents } from './useKeyEvents';
import { ThreeVis } from './ThreeVis/ThreeVis';

// controls
const defaultSpeed = 250;
const defaultSphereSize = 1
const speedStep = 25;
const minSpeed = 25;
const maxSpeed = 2500;
const sphereSizeStep = 0.25;

const App = () => {
  const [ fileData, setFileData ] = useState(null);
  const eaData = useEAData(fileData);
  const { n, nPoints, maxTime } = eaData;
  const [ sphereSize, setSphereSize ] = useState(defaultSphereSize);
  const [ speed, setSpeed ] = useState(defaultSpeed);
  const [ time, setTime ] = useState(0);
  const data = useMemo(() => ({
    points: eaData.points[time],
    colors: eaData.colors[time],
    pointsData: eaData.pointsData[time],
    thisTime: eaData.times[time]
  }), [ time, eaData ]);
  const { PlayerControl, stopPlay, tooglePlay } = usePlayerControl({ n, setTime, time, speed });
  useKeyEvents({ tooglePlay, setTime, n, setSpeed, speedStep, minSpeed, maxSpeed })

  return (
    <div className='main-container'>
      <div className='canvas-container'>
        <div className='time-dialog'>
          {`Time: ${data.thisTime}/${maxTime}`}
        </div>
        <ThreeVis {...{data, sphereSize, nPoints, speed }} />
      </div>
      <div className='html-bottom-container'>
        <ProgressBar
          min={0}
          max={n-1}
          now={time}
          label={`${time}/${n-1} gen`}
          onChange={(e,value) => setTime(value) }
        />
        { PlayerControl }
        <div className='row'>
          <GeneralSlider
            className={'col-4 offset-4'}
            min={25}
            max={2500}
            now={speed}
            step={speedStep}
            valueLabelFormat={d => `${d} ms`}
            unit={'ms'}
            defaultValue={defaultSpeed}
            onChange={(e,value) => setSpeed(value)}
          />
          <GeneralSlider
            className={'col-1 offset-1'}
            min={0.25}
            max={5}
            now={sphereSize}
            step={sphereSizeStep}
            valueLabelFormat={d => `${d.toFixed(2)} sz`}
            defaultValue={defaultSphereSize}
            onChange={(e,value) => setSphereSize(value)}
          />
        </div>
        <FileUpload
          className='row file-upload offset-1'
          setContent={d => {
            setFileData(d);
            setTime(0);
            stopPlay();
          }}
        />
        <div className='git-info row justify-content-end'>
          <a href='https://github.com/renato145/show_evolution'>Source code</a>
        </div>
      </div>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
