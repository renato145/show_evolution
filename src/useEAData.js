import { useMemo } from 'react';
import { scaleLinear, max } from 'd3';
import eaData from './data/ea_data.json';
const THREE = require('three');

const pointsScale = 25; // Size to fill the screen

// const colors = ['#ffd700', '#ffb14e', '#fa8775', '#ea5f94', '#cd34b5', '#9d02d7', '#0000ff'];

const getColor = d => {
  let color;
  switch (d) {
    case 'best':
      color = new THREE.Color('#5edc1f');
      break;
  
    case 'infeasible':
      color = new THREE.Color('#dd3300');
      break;

    default:
      color = new THREE.Color('#0000ff');
  }
  return color.toArray();
};

const computeColors = data => {
  const colors = data.map(d => (
    d.is_best
      ? 'best'
      : d.is_feasible ? 'normal' : 'infeasible'
  )).map(getColor).flat();
  return colors;
};

export const useEAData = ( fileData ) => ( 
  useMemo(() => {
    const sourceData = fileData ? fileData : eaData;
    const { data, limits } = sourceData;
    const n = data.length;
    const nPoints = Object.keys(data[0]).length;
    const times = data.map(d => d[0].time);
    const maxTime = max(times);
    const scale = scaleLinear().domain(limits).range([-pointsScale,pointsScale]);
    const points = data.map(d => d.map(point => [...point.data.map(scale),0]).flat());
    const colors = data.map(computeColors);

    const pointsData = data.map(d => d.map( point => (
      `Individual ${point.idx} ${point.is_best ? '(Best!)' : ''}
       Fitness value: ${point.fitness_value.toFixed(2)}
       Constraints sum: ${point.constraints_sum.toFixed(2)}
       Feasible: ${point.is_feasible}
       Time: ${point.time}
       `
    )));

    return { n, nPoints, times, maxTime, points, colors, pointsData };
  }, [ fileData ])
);