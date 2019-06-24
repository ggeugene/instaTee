import React, { Component } from 'react'
import LayerImage from './LayerImage'
import { connect } from 'react-redux'

class ImageList extends Component {
  resizeImageOnUpload(image, area) {
    let newImageSize = {
      width: image.dimensions.width,
      height: image.dimensions.height,
    }
    if (area) {
      let areaSize = getComputedStyle(area)
      let areaWidth = parseFloat(areaSize.width, 10)
      let areaHeight = parseFloat(areaSize.height, 10)

      if (newImageSize.width > areaWidth) {
        newImageSize.width = areaWidth
        newImageSize.height =
          newImageSize.width /
          (image.dimensions.width / image.dimensions.height)
      }
      if (newImageSize.height > areaHeight) {
        newImageSize.width =
          (newImageSize.width / newImageSize.height) * areaHeight
        newImageSize.height = areaHeight
        console.log(newImageSize.width + '    ' + newImageSize.height)
      }
    }
    return newImageSize
  }

  render() {
    return this.props.images.map(image => {
      let imageSize = this.resizeImageOnUpload(image, this.props.area)
      return (
        <div
          key={image.id}
          className='single-layer__container'
          style={{
            width: imageSize.width + 'px',
            height: imageSize.width + 'px',
          }}>
          <LayerImage {...image} sizeToFit={imageSize} />
        </div>
      )
    })
  }
}

const mapStateToProps = state => {
  console.log(state.layers)
  return {
    images: state.layers,
  }
}

export default connect(mapStateToProps)(ImageList)
