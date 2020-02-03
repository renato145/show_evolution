import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useEAData } from './useEAData';
import { ProgressBar, SpeedBar } from './sliders';
import { FileUpload } from './FileUpload';
import './index.css';
import { PlayerControl } from './PlayerControl';
import { ThreeVis } from './ThreeVis/ThreeVis';

// controls
const defaultSpeed = 250;
const defaultSphereSize = 0.5

const App = () => {
  const [ fileData, setFileData ] = useState(null);
  const eaData = useEAData(fileData);
  const { n, nPoints, maxTime } = eaData;
  const [ sphereSize, setSphereSize ] = useState(defaultSphereSize);
  const [ speed, setSpeed ] = useState(defaultSpeed);
  const [ time, setTime ] = useState(0);
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const data = useMemo(() => ({
    points: eaData.points[time],
    colors: eaData.colors[time],
    pointsData: eaData.pointsData[time],
    thisTime: eaData.times[time]
  }), [ time, eaData ]);

  return (
    <div className='main-container'>
      <div className='canvas-container'>
        <div className='time-dialog'>
          {`Time: ${data.thisTime}/${maxTime}`}
        </div>
        <ThreeVis {...{data, sphereSize, selectedPoint, setSelectedPoint, nPoints}} />
      </div>
      <div className='html-bottom-container'>
        <ProgressBar
          min={0}
          max={n-1}
          now={time}
          label={`${time}/${n-1} gen`}
          onChange={(e,value) => setTime(value) }
        />
        <PlayerControl {...{ n, setTime, time, speed }} />
        <SpeedBar
          min={25}
          max={2500}
          step={25}
          defaultValue={defaultSpeed}
          onChange={(e,value) => setSpeed(value)}
        />
        <SpeedBar
          min={0.1}
          max={2}
          step={0.1}
          defaultValue={defaultSphereSize}
          onChange={(e,value) => setSphereSize(value)}
        />
        <FileUpload
          className='row file-upload offset-1'
          setContent={setFileData}
        />
        <div className='git-info row justify-content-end'>
          <a href='https://github.com/renato145/show_evolution'>Source code</a>
        </div>
      </div>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
