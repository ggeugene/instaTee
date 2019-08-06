import React, { Component } from 'react'
import RangeSlider from './RangeSlider'
import { connect } from 'react-redux'

class ImageSettings extends Component {
  render() {
    const { layers } = this.props
    let isFocused = layers.filter(
      layer => layer.isFocused && layer.type === 'image'
    )
    return (
      <div
        style={{
          display: isFocused.length ? 'block' : 'none',
        }}>
        <RangeSlider
          classes={'brightness'}
          label={'Brightness'}
          min={0}
          max={2}
          value={1}
        />
        <RangeSlider
          classes={'contrast'}
          label={'Contrast'}
          min={0}
          max={200}
          value={100}
        />
        <RangeSlider
          classes={'hue'}
          label={'Hue'}
          min={-360}
          max={360}
          value={0}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({ layers: state.layers })
ImageSettings = connect(
  mapStateToProps,
  null
)(ImageSettings)

export default ImageSettings
