import React, { PureComponent } from 'react'
// import { getEmptyImage } from 'react-dnd-html5-backend'
import LayerImage from './LayerImage'

class ImageDragPreview extends PureComponent {
  render() {
    const { content, size, rotateAngle } = this.props
    const styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      transform: `rotate(${rotateAngle.degree}deg)`,
    }
    return (
      <div className='focused-layer' style={styles}>
        <LayerImage content={content} />
        <div className='transform-layer rotate-layer' />
        <div className='transform-layer resize-layer' />
      </div>
    )
  }
}

export default ImageDragPreview
