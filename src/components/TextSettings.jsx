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

    return layer.length ? (
      <div key={layer[0].id} className='text-settings'>
        <TextInput content={layer[0].content} layerId={layer[0].id} />
        <div>
          {/* <FontFamilySelect /> */}
          <TextSize layerId={layer[0].id} fontSize={layer[0].props.fontSize} />
        </div>
        <ColorPicker
          layerId={layer[0].id}
          color={layer[0].props.color}
          action={'fill'}
          title={'Text'}
        />
        <ColorPicker
          layerId={layer[0].id}
          color={layer[0].props.color}
          action={'stroke'}
          title={'Stroke'}
        />
        <div className='settings-row'>
          <TextAlign align={layer[0].props.align} layerId={layer[0].id} />
          <TextType types={layer[0].props.style} layerId={layer[0].id} />
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
