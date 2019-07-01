import React, { PureComponent } from 'react'
import LayerImage from './LayerImage'
import { connect } from 'react-redux'
import { resizeLayer } from '../actions'

class ImageList extends PureComponent {
  render() {
    return this.props.images.map(image => {
      return <LayerImage key={image.id} {...image} sizeToFit={image.size} />
    })
  }
}

const mapStateToProps = state => ({ images: state.layers })

const mapDispatchToProps = dispatch => ({
  resizeLayer: (image, size) => dispatch(resizeLayer(image, size)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageList)
