import React, { Component } from 'react'
import RangeSlider from './RangeSlider'
import { connect } from 'react-redux'

class ImageSettings extends Component {
  render() {
    const { layers } = this.props
    const focused = layers.filter(
      layer => layer.isFocused && layer.type === 'image'
    )
    return focused.length ? (
      <div>
        <RangeSlider
          classes={'brightness'}
          sliderId='brightness'
          label={'Brightness'}
          min={0}
          max={2}
          value={focused.length ? focused[0].props.brightness : 1}
          focused={focused.length ? focused[0] : null}
        />
        <RangeSlider
          classes={'contrast'}
          sliderId='contrast'
          label={'Contrast'}
          min={0}
          max={200}
          value={focused.length ? focused[0].props.contrast : 100}
          focused={focused.length ? focused[0] : null}
        />
        <RangeSlider
          classes={'hue'}
          sliderId='hue'
          label={'Hue'}
          min={-360}
          max={360}
          value={focused.length ? focused[0].props.hue : 0}
          focused={focused.length ? focused[0] : null}
        />
      </div>
    ) : null
  }
}

const mapStateToProps = state => ({ layers: state.layers })
ImageSettings = connect(
  mapStateToProps,
  null
)(ImageSettings)

export default ImageSettings
