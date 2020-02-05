import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Slider, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const ProgressBarSlider = withStyles({ 
  root: {
    // color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const BaseSlider = withStyles({
  root: {
    color: '#8f8f8f',
  },
  thumb: {
    height: 15,
    width: 15,
    margintop: -5,
    marginleft: -5,
    color: '#787878',
  },
  valueLabel: {
    top: 20,
    '& *': {
      background: 'transparent',
      color: '#000',
      width: 50
    },
  },
  rail: {
    height: 5,
  },
})(Slider);

export const ProgressBar = ({ min, max, now, label, onChange }) => {
  return (
    <div className='row'>
      <ProgressBarSlider
        className='col-8 offset-2'
        defaultValue={0}
        valueLabelDisplay='off'
        aria-label='pretto slider'
        min={min}
        max={max}
        value={now}
        step={1}
        onChange={onChange}
      />
      <Typography className='col-2 align-self-center'>{label}</Typography>
    </div>
  );
};

export const GeneralSlider = ({ min, max, now, step, defaultValue, valueLabelFormat, onChange, className }) => {
  return (
    <BaseSlider
      className={className}
      defaultValue={defaultValue}
      valueLabelFormat={valueLabelFormat}
      valueLabelDisplay='on'
      aria-label='pretto slider'
      min={min}
      max={max}
      value={now}
      step={step}
      onChange={onChange}
      track={false}
    />
  );
};
