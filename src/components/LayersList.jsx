import React, { Component } from 'react'
import TextSettings from './TextSettings'
import ImageSettings from './ImageSettings'
import LayerListItem from './LayerListItem'
import { connect } from 'react-redux'

class LayersList extends Component {
  render() {
    const { layers } = this.props

    return layers.map(layer => (
      <div
        key={layer.id}
        className='layer-list-item'
        style={{ padding: '5px 20px' }}>
        <LayerListItem {...layer} />
        {layer.type === 'image' ? (
          <ImageSettings layer={layer} />
        ) : (
          <TextSettings layer={layer} />
        )}
      </div>
    ))
  }
}

const mapStateToProps = state => ({ layers: state.layers })

export default connect(
  mapStateToProps,
  null
)(LayersList)
