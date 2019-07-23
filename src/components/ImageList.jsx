import React, { Component } from 'react'
import DraggableImage from './DraggableImage'
import { connect } from 'react-redux'

class ImageList extends Component {
  render() {
    const { area, isFocused } = this.props
    return this.props.images.map(image => {
      return image.isFocused === isFocused ? (
        <DraggableImage key={image.id} {...image} area={area} />
      ) : null
    })
  }
}

const mapStateToProps = state => ({ images: state.layers })

export default connect(mapStateToProps)(ImageList)
