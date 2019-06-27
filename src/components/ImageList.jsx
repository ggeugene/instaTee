import React, { PureComponent } from 'react'
import LayerImage from './LayerImage'
import { connect } from 'react-redux'
import { resizeLayer } from '../actions'

class ImageList extends PureComponent {
  render() {
    return this.props.images.map(image => {
      console.log(image)
      return (
        <div
          key={image.id}
          className='single-layer__container'
          style={{
            width: image.size.width + 'px',
            height: image.size.height + 'px',
          }}
          onClick={() =>
            this.props.resizeLayer(image, { width: 100, height: 100 })
          }>
          <LayerImage {...image} sizeToFit={image.size} />
        </div>
      )
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
