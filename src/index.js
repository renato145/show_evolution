import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faCaretLeft, faCaretRight, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useSpring } from 'react-spring-three';
import { HoverDescription } from './HoverDescription';
import { d3Controls } from './d3Controls';
import { useCustomHover } from './useCustomHover';
import { useEAData } from './useEAData';
import { ProgressBar, SpeedBar } from './sliders';
import './index.css';
const THREE = require('three');
// const d3 = require('d3');

// controls
const defaultSpeed = 250;
// camera settings
const fov = 30;
const near = 1;
const far = 150;
const defaultCameraZoom = 100;
// canvas settings
const backgroundColor = new THREE.Color(0xefefef);
// points settings
const pointsSize = 10;
const highlightPointSize = 25;
const sprite = new THREE.TextureLoader().load('textures/discNoShadow.png');

const Scene = ({
  data: { points, colors, pointsData },
  setHoverData,
  nPoints
}) => {
  const { scene, aspect, gl, camera, size, mouse } = useThree();
  const ref = useRef();
  const pointsRef = useRef();
  const geometryRef = useRef();

  // d3 controls (zoom and pan)
  useEffect(() => {
    d3Controls({ fov, near, far, defaultCameraZoom, renderer: gl, camera, size});
  }, [ gl, camera, size ])

  // Custom hover
  const highlightRef = useRef();
  const highlightPoint = useMemo(() => ({
    point: new Float32Array(3),
    color: new Float32Array(3),
    show: false,
  }), []);

  const onPointHover = useCallback(( { index, x, y } ) => {
    // Highlight Point
    positionsArray.slice(index*3,(index+1)*3).forEach( (d, i) => {highlightPoint.point[i] = d});
    colorsArray.slice(index*3,(index+1)*3).forEach( (d, i) => {highlightPoint.color[i] = d});
    highlightPoint.show = true;
    highlightRef.current.attributes.position.needsUpdate = true;
    highlightRef.current.attributes.color.needsUpdate = true;

    // hover description
    const pointColor = colors.slice(index*3, (index+1)*3).map(d => d.toFixed(2));
    setHoverData(HoverDescription({
      description: pointsData[index],
      top: y,
      left: x,
      size
    }));
  }, [ points, size, pointsData, colors ]);

  const onPointOut = () => {
    highlightPoint.show = false;
    setHoverData('');
  };

  useCustomHover({ renderer: gl, mouse, camera, size, pointsRef, onPointHover, onPointOut });

  // Initialize arrays
  const positionsArray = useMemo(() => new Float32Array(nPoints*3), []);
  const colorsArray = useMemo(() => new Float32Array(nPoints*3), []);

  // Initialize springs
  const [ { pointsSpring, colorsSpring }, setSpring ] = useSpring(() => ({
    // initial position
    pointsSpring: points,
    colorsSpring: Array(nPoints*3).fill(1),
  }));

  // Animation effects
  useEffect(() => {
    setSpring({ pointsSpring: points });
  }, [ points, setSpring ]);

  useEffect(() => {
    setSpring({ colorsSpring: colors });
  }, [ colors, setSpring ]);

  // Animate point change
  useFrame(() => {
    pointsSpring.getValue().forEach((v,i) => {
      const value = (i%3) === 0 ? v*aspect : v; // consider aspect
      positionsArray[i] = value;
    });
    colorsSpring.getValue().forEach((v,i) => {
      colorsArray[i] = v;
    })
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
  });

  useEffect(() => {
    scene.background = backgroundColor;
  }, [ scene ]);

  return (
    <group>

      <mesh ref={ref}>
        <points ref={pointsRef}>
          <bufferGeometry
            attach='geometry'
            ref={geometryRef}
          >
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={points.length / 3}
              array={positionsArray}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
            <bufferAttribute
              attachObject={['attributes', 'color']}
              count={points.length / 3}
              array={colorsArray}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
          </bufferGeometry>
          <pointsMaterial
            attach='material'
            size={pointsSize}
            map={sprite}
            transparent={true}
            alphaTest={0.5}
            sizeAttenuation={false}
            vertexColors={THREE.VertexColors}
          />
        </points>
      </mesh>

      <mesh>
        <points>
          <bufferGeometry
            attach='geometry'
            ref={highlightRef}
          >
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={highlightPoint.show}
              array={highlightPoint.point}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            /> 
            <bufferAttribute
              attachObject={['attributes', 'color']}
              count={1}
              array={highlightPoint.color}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
          </bufferGeometry>
          <pointsMaterial
            attach='material'
            size={highlightPointSize}
            map={sprite}
            transparent={true}
            alphaTest={0.5}
            sizeAttenuation={false}
            vertexColors={THREE.VertexColors}
          />
        </points>
      </mesh>

    </group>

  );
};

const App = () => {
  const eaData = useEAData();
  const { n, nPoints, maxTime } = eaData;
  const [ speed, setSpeed ] = useState(defaultSpeed);
  const [ time, setTime ] = useState(0);
  const [ play, setPlay ] = useState(false);
  const [ hoverData, setHoverData] = useState('');
  const data = useMemo(() => ({
    points: eaData.points[time],
    colors: eaData.colors[time],
    pointsData: eaData.pointsData[time],
    thisTime: eaData.times[time]
  }), [ time ]);

  const playRef = useRef();
  const [ playCb, setPlayCb ] = useState(null)
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
    <div style={{height: '100%'}}>
      <div className='canvas-container h-100'>
        <div className='time-dialog'>
          {`Time\n${data.thisTime}/${maxTime}`}
        </div>
        <Canvas
          camera={{
            fov: fov,
            near: 0.1,
            far: far+1,
            position: [0, 0, defaultCameraZoom]
          }}
        >
          <Scene
            data={data}
            setHoverData={setHoverData}
            nPoints={nPoints}
          />
        </Canvas>
        {hoverData}
        <ProgressBar
          min={0}
          max={n-1}
          now={time}
          label={`${time}/${n-1} gen`}
          onChange={(e,value) => setTime(value) }
        />
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
        <SpeedBar
          min={25}
          max={2500}
          step={25}
          defaultValue={defaultSpeed}
          onChange={(e,value) => setSpeed(value)}
        />
        <div className='git-info row justify-content-end'>
          <a href='https://github.com/renato145/show_evolution'>Source code</a>
        </div>
      </div>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
