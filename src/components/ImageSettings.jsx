import React, { Component } from 'react'
import RangeSlider from './RangeSlider'
import { connect } from 'react-redux'
import '../css/range-slider.css'

class ImageSettings extends Component {
  render() {
    const { layer } = this.props
    return layer.length ? (
      <div key={layer[0].id}>
        <RangeSlider
          classes={'brightness'}
          sliderId='brightness'
          label={'Brightness'}
          min={0}
          max={2}
          value={layer.length ? layer[0].props.brightness : 1}
          focused={layer.length ? layer[0] : null}
        />
        <RangeSlider
          classes={'contrast'}
          sliderId='contrast'
          label={'Contrast'}
          min={0}
          max={200}
          value={layer.length ? layer[0].props.contrast : 100}
          focused={layer.length ? layer[0] : null}
        />
        <RangeSlider
          classes={'hue'}
          sliderId='hue'
          label={'Hue'}
          min={0}
          max={360}
          value={layer.length ? layer[0].props.hue : 0}
          focused={layer.length ? layer[0] : null}
        />
      </div>
    ) : null
  }
}

const mapStateToProps = state => ({
  layer: state.layers.filter(
    layer => layer.isFocused && layer.type === 'image'
  ),
})
ImageSettings = connect(
  mapStateToProps,
  null
)(ImageSettings)

export default ImageSettings
