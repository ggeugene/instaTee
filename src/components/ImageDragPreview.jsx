import React, { PureComponent } from 'react'
// import { getEmptyImage } from 'react-dnd-html5-backend'
import LayerImage from './LayerImage'

class ImageDragPreview extends PureComponent {
  render() {
    const { content, size, rotateAngle, back } = this.props
    const styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      transform: `rotate(${rotateAngle.degree}deg)`,
    }
    return (
      <div className={back ? 'focused-layer' : ''} style={styles}>
        <LayerImage
          content={content}
          opacity={back ? 0.2 : 1}
          back={back ? back : null}
        />
        {/* <div className='transform-layer rotate-layer'>R</div>
        <div className='transform-layer resize-layer'>S</div>
        <div className='transform-layer delete-layer'>D</div>
        <div className='transform-layer center-layer'>C</div> */}
      </div>
    )
  }
}

export default ImageDragPreview
