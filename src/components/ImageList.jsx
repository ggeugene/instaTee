import React, { PureComponent } from 'react'
import LayerImage from './LayerImage'
import { connect } from 'react-redux'

class ImageList extends PureComponent {
  render() {
    return this.props.images.map(image => {
      return <LayerImage key={image.id} {...image} />
    })
  }
}

const mapStateToProps = state => ({ images: state.layers })

export default connect(
  mapStateToProps
)(ImageList)
