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
            fontSize={focusedLayer.props.fontSize}
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
          />
          <TextType
            types={focusedLayer.props.style}
            layerId={focusedLayer.id}
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
