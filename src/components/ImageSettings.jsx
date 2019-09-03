import React, { Component } from 'react'
import RangeSlider from './RangeSlider'
import '../css/range-slider.scss'

class ImageSettings extends Component {
  render() {
    const { layer } = this.props
    const { isFocused } = layer
    return isFocused ? (
      <div key={layer.id} className='image-settings'>
        <RangeSlider
          classes={'brightness'}
          sliderId='brightness'
          label={'Brightness'}
          min={0}
          max={2}
          value={layer.length ? layer.props.brightness : 1}
          focused={layer.length ? layer : null}
        />
        <RangeSlider
          classes={'contrast'}
          sliderId='contrast'
          label={'Contrast'}
          min={0}
          max={200}
          value={layer.length ? layer.props.contrast : 100}
          focused={layer.length ? layer : null}
        />
        <RangeSlider
          classes={'hue'}
          sliderId='hue'
          label={'Hue'}
          min={0}
          max={360}
          value={layer.length ? layer.props.hue : 0}
          focused={layer.length ? layer : null}
        />
      </div>
    ) : null
  }
}

export default ImageSettings
