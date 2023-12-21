import React from 'react';
import {RangeSlider, TextField} from '@shopify/polaris';

const InputWrapper = ({label, unit, value, helpText, onChangeInput, type, max = 30, min = 0}) => {
  return (
    <RangeSlider
      label={label}
      value={value}
      onChange={value => onChangeInput(type, value)}
      min={min}
      max={max}
      suffix={
        <div style={{width: '110px'}}>
          <TextField
            label=""
            autoComplete="off"
            suffix={`${unit}(s)`}
            value={value && value.toString()}
            onChange={value => onChangeInput(type, Number(value))}
          />
        </div>
      }
      helpText={helpText}
    />
  );
};
export default InputWrapper;
