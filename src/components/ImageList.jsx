import React, { Component } from 'react'
import DraggableImage from './DraggableImage'
import { connect } from 'react-redux'

class ImageList extends Component {
  render() {
    const { area } = this.props
    return this.props.images.map(image => {
      return <DraggableImage key={image.id} {...image} area={area} />
    })
  }
}

const mapStateToProps = state => ({ images: state.layers })

export default connect(mapStateToProps)(ImageList)
