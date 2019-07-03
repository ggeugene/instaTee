import React, { Component } from 'react'
import DraggableImage from './DraggableImage'
import { connect } from 'react-redux'

class ImageList extends Component {
  render() {
    return this.props.images.map(image => {
      return <DraggableImage key={image.id} {...image} />
    })
  }
}

const mapStateToProps = state => ({ images: state.layers })

export default connect(mapStateToProps)(ImageList)
