import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextInput from './text-props/TextInput'
import FontFamilySelect from './text-props/FontFamilySelect'
import TextSize from './text-props/TextSize'
import ColorPicker from './text-props/ColorPicker'
import TextAlign from './text-props/TextAlign'
import TextType from './text-props/TextType'
import '../css/text-settings.css'

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

  getNewCoords(id, coords, rotateAngle, newFontSize) {
    let size = {}
    let newSize = {}

    let layers = document.querySelectorAll(`[data-id="${id}"]`)

    size = this.getLayerSize(layers[0], rotateAngle)

    layers.forEach(layer => (layer.style.fontSize = newFontSize + 'px'))

    newSize = this.getLayerSize(layers[0], rotateAngle)

    coords.x = coords.x - (newSize.width - size.width) / 2
    coords.y = coords.y - (newSize.height - size.height) / 2

    return { ...coords }
  }
  render() {
    const { layer } = this.props
    const focusedLayer = layer.length ? layer[0] : null

    return focusedLayer ? (
      <div key={focusedLayer.id} className='text-settings'>
        <TextInput content={focusedLayer.content} layerId={focusedLayer.id} />
        <div className='settings-row'>
          {/* <FontFamilySelect /> */}
          <TextSize
            layerId={focusedLayer.id}
            coords={focusedLayer.coords}
            rotateAngle={focusedLayer.rotateAngle.degree}
            fontSize={focusedLayer.props.fontSize}
            getNewCoords={this.getNewCoords}
          />
        </div>
        <ColorPicker
          layerId={focusedLayer.id}
          color={focusedLayer.props.color}
          action={'fill'}
          title={'Text'}
        />
        <ColorPicker
          layerId={focusedLayer.id}
          color={
            focusedLayer.props.colorStroke
              ? focusedLayer.props.colorStroke
              : '#'
          }
          action={'stroke'}
          title={'Stroke'}
        />
        <div className='settings-row'>
          <TextAlign
            align={focusedLayer.props.align}
            layerId={focusedLayer.id}
            getNewCoords={this.getNewCoords}
          />
          <TextType
            types={focusedLayer.props.style}
            layerId={focusedLayer.id}
            getNewCoords={this.getNewCoords}
          />
        </div>
      </div>
    ) : null
  }
}

const mapStateToProps = state => ({
  layer: state.layers.filter(layer => layer.type === 'text' && layer.isFocused),
})

export default connect(
  mapStateToProps,
  null
)(TextSettings)
