import React from 'react'
import PropTypes from 'prop-types'
import reactCSS from 'reactcss'

import { Swatch } from 'react-color/lib/components/common'

export const SketchPresetColors = ({ colors, onClick = () => {}, onSwatchHover }) => {
  const styles = reactCSS(
    {
      default: {
        colors: {
          marginTop: '10px',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        },
        swatchWrap: {
          width: '10.75%',
          height: 22,
          margin: '0 2% 2% 0',
          boxSizing: 'border-box',
        },
        swatch: {
          border: '1px solid #c3c1c8',
        },
      },
      'no-presets': {
        colors: {
          display: 'none',
        },
      },
    },
    {
      'no-presets': !colors || !colors.length,
    }
  )

  const handleClick = (hex, e) => {
    onClick(
      {
        hex,
        source: 'hex',
      },
      e
    )
  }

  return (
    <div style={styles.colors} className='flexbox-fix'>
      {colors.map(colorObjOrString => {
        const c = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString
        const key = `${c.color}${c.title || ''}`
        return (
          <div key={key} style={styles.swatchWrap} className='swatch-wrap'>
            <Swatch {...c} onClick={handleClick} onHover={onSwatchHover} />
          </div>
        )
      })}
    </div>
  )
}

SketchPresetColors.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        color: PropTypes.string,
        title: PropTypes.string,
      }),
    ])
  ).isRequired,
}

export default SketchPresetColors
