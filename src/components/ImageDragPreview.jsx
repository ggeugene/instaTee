import React, { Component } from 'react'
// import { getEmptyImage } from 'react-dnd-html5-backend'
import LayerImage from './LayerImage'

const styles = {
  display: 'inline-block',
  transform: 'rotate(45deg)',
  WebkitTransform: 'rotate(45deg)',
}

class ImageDragPreview extends Component {
  render() {
    // console.log(this.props)
    const { content, size } = this.props
    return (
      <div styles={styles}>
        <LayerImage content={content} size={size} />
      </div>
    )
  }
}

export default ImageDragPreview
