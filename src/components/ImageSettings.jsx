import React, { Component } from 'react'
import RangeSlider from './RangeSlider'
import '../css/range-slider.scss'

class ImageSettings extends Component {
  render() {
    const { layer } = this.props

    return layer.isFocused ? (
      <div key={layer.id} className='image-settings'>
        <RangeSlider
          classes={'brightness'}
          sliderId='brightness'
          label={'Brightness'}
          min={0}
          max={2}
          value={layer ? layer.props.brightness : 1}
          focused={layer ? layer : null}
        />
        <RangeSlider
          classes={'contrast'}
          sliderId='contrast'
          label={'Contrast'}
          min={0}
          max={200}
          value={layer ? layer.props.contrast : 100}
          focused={layer ? layer : null}
        />
        <RangeSlider
          classes={'hue'}
          sliderId='hue'
          label={'Hue'}
          min={0}
          max={360}
          value={layer ? layer.props.hue : 0}
          focused={layer ? layer : null}
        />
      </div>
    ) : null
  }
}

export default ImageSettings
