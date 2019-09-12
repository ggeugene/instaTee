import React from 'react'

import { CustomPicker } from 'react-color'
import { EditableInput, Saturation, Hue } from 'react-color/lib/components/common'
import SketchPresetColors from './SketchPresetColors'

export const CustomColorPicker = ({
  hex,
  hsl,
  hsv,
  onChange,
  presetColors,
  onSwatchHover,
  title,
}) => {
  const styles = {
    picker: {
      padding: '32px',
      boxSizing: 'initial',
      background: '#fff',
      width: '222px',
      position: 'absolute',
      top: 152,
      left: 32,
    },
    saturation: {
      paddingBottom: '222px',
      position: 'relative',
      overflow: 'hidden',
    },
    Saturation: {
      radius: '3px',
      shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
    },
    hue: {
      height: 10,
      position: 'relative',
      margin: '10px 0',
    },
    input: {
      maxWidth: '71px',
      width: '70px',
      fontSize: '15px',
      lineHeight: 1.2,
      letterSpacing: '0.75px',
      color: '#353434',
      border: 'none',
      '&:focus': {
        outline: 'none',
      },
    },
    swatch: {
      width: 22,
      height: 22,
      background: hex,
      border: '1px solid #c3c1c8',
      marginRight: 12,
    },
  }
  return (
    <div style={styles.picker} className='react-color__picker'>
      <h2 className='color-picker__title'>{title} color palette</h2>
      <div style={styles.saturation}>
        <Saturation style={styles.Saturation} hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>
      <div style={styles.hue}>
        <Hue hsl={hsl} onChange={onChange} />
      </div>

      <div className='flex-row flex-start'>
        <div style={styles.swatch} className='color-picker__swatch' />
        <EditableInput style={{ input: styles.input }} value={hex} onChange={onChange} />
      </div>
      <SketchPresetColors colors={presetColors} onClick={onChange} onSwatchHover={onSwatchHover} />
    </div>
  )
}

CustomColorPicker.defaultProps = {
  presetColors: [
    '#D0021B',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
  ],
}

export default CustomPicker(CustomColorPicker)
