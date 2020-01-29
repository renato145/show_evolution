import { useMemo } from 'react';
import { scaleLinear } from 'd3';
import eaData from './data/ea_data.json';
const THREE = require('three');

const pointsScale = 25; // Size to fill the screen

// const colors = ['#ffd700', '#ffb14e', '#fa8775', '#ea5f94', '#cd34b5', '#9d02d7', '#0000ff'];

const getColor = d => {
  let color;
  switch (d) {
    case 'best':
      color = new THREE.Color('#fa8775');
      break;
  
    default:
      color = new THREE.Color('#9d02d7');
  }
  return color.toArray();
};

const computeColors = data => {
  const colors = data.map(d => d.is_best ? 'best' : 'normal').map(getColor).flat();
  return colors;
};

export const useEAData = () => ( 
  useMemo(() => {
    const { data, limits } = eaData;
    const n = data.length;
    const nPoints = Object.keys(data[0]).length;
    const scale = scaleLinear().domain(limits).range([-pointsScale,pointsScale]);

    const points = data.map(d => d.map(point => [...point.data.map(scale),0]).flat());

    const colors = data.map(computeColors);

    const pointsData = data.map(d => d.map((point,i) => (
      `Individual ${i} ${point.is_best ? '(Best!)' : ''}
       Fitness value: ${point.fitness_value.toFixed(2)}
       Constraints sum: ${point.constraints_sum.toFixed(2)}
       Feasible: ${point.is_feasible}
       Time: ${point.time}
       `
    )));

    return { n, points, colors, pointsData, nPoints };
  }, [])
);