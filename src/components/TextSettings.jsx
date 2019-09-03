import React, { Component } from 'react'
// import { connect } from 'react-redux'

import TextInput from './text-props/TextInput'
import FontFamilySelect from './text-props/FontFamilySelect'
import TextSize from './text-props/TextSize'
import ColorPicker from './text-props/ColorPicker'
import TextAlign from './text-props/TextAlign'
import TextType from './text-props/TextType'
import '../css/text-settings.scss'

class TextSettings extends Component {
  constructor(props) {
    super(props)

    this.getLayerSize = this.getLayerSize.bind(this)
    this.getNewCoords = this.getNewCoords.bind(this)
  }

  getLayerSize(layer, rotateAngle) {
    let size = {}
    if (rotateAngle !== 0) {
      const layerStyles = getComputedStyle(layer)
      size.width = parseFloat(layerStyles.width)
      size.height = parseFloat(layerStyles.height)
    } else {
      const layerPosition = layer.getBoundingClientRect()
      size.width = layerPosition.width
      size.height = layerPosition.height
    }
    return { ...size }
  }

  getNewCoords(id, coords, rotateAngle, callback) {
    let size = {}
    let newSize = {}

    let layer = document.querySelector(`[data-id="${id}"]`)

    size = this.getLayerSize(layer, rotateAngle)

    callback()

    newSize = this.getLayerSize(layer, rotateAngle)

    coords.x = coords.x - (newSize.width - size.width) / 2
    coords.y = coords.y - (newSize.height - size.height) / 2

    return { ...coords }
  }

  render() {
    const { layer } = this.props
    const focusedLayer = layer.isFocused ? true : false

    return focusedLayer ? (
      <div key={layer.id} className='text-settings'>
        <TextInput
          content={layer.content}
          layerId={layer.id}
          coords={layer.coords}
          rotateAngle={layer.rotateAngle.degree}
          getNewCoords={this.getNewCoords}
        />
        <div className='settings-row'>
          <FontFamilySelect
            layerId={layer.id}
            coords={layer.coords}
            rotateAngle={layer.rotateAngle.degree}
            fontFamily={layer.props.fontFamily}
            getNewCoords={this.getNewCoords}
          />
          <TextSize
            layerId={layer.id}
            coords={layer.coords}
            rotateAngle={layer.rotateAngle.degree}
            fontSize={layer.props.fontSize}
            getNewCoords={this.getNewCoords}
          />
        </div>
        <ColorPicker
          layerId={layer.id}
          color={layer.props.color}
          action={'fill'}
          title={'Text'}
        />
        <ColorPicker
          layerId={layer.id}
          color={layer.props.colorStroke ? layer.props.colorStroke : '#'}
          action={'stroke'}
          title={'Stroke'}
        />
        <div className='settings-row'>
          <TextAlign align={layer.props.align} layerId={layer.id} />
          <TextType
            types={layer.props.style}
            layerId={layer.id}
            coords={layer.coords}
            rotateAngle={layer.rotateAngle.degree}
            getNewCoords={this.getNewCoords}
          />
        </div>
      </div>
    ) : null
  }
}

export default TextSettings
