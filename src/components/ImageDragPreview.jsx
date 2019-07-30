import React, { PureComponent } from 'react'
// import { getEmptyImage } from 'react-dnd-html5-backend'
import LayerImage from './LayerImage'

class ImageDragPreview extends PureComponent {
  render() {
    const {
      content,
      size,
      rotateAngle,
      back,
      setCornerRef,
      setImageRef,
    } = this.props
    const styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      transform: `rotate(${rotateAngle.degree}deg)`,
    }
    let element = back ? (
      <div className={'focused-layer'} style={styles}>
        <LayerImage
          content={content}
          opacity={0.2}
          back={back}
          setImageRef={setImageRef}
        />
        <div className='corners'>
          <div
            className='corner top-left'
            ref={div => setCornerRef(div, 'topLeft')}
          />
          <div
            className='corner top-right'
            ref={div => setCornerRef(div, 'topRight')}
          />
          <div
            className='corner bottom-right'
            ref={div => setCornerRef(div, 'bottomRight')}
          />
          <div
            className='corner bottom-left'
            ref={div => setCornerRef(div, 'bottomLeft')}
          />
        </div>
        {/* <div className='transform-layer rotate-layer'>R</div>
        <div className='transform-layer resize-layer'>S</div>
        <div className='transform-layer delete-layer'>D</div>
        <div className='transform-layer center-layer'>C</div> */}
      </div>
    ) : (
      <div style={styles}>
        <LayerImage content={content} opacity={1} back={null} />
      </div>
    )
    return element
  }
}

export default ImageDragPreview
