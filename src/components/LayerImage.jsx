// import React from 'react'

// const LayerImage = ({ content, dimensions, sizeToFit }) => {
//   sizeToFit.width = sizeToFit.width + 'px'
//   sizeToFit.height = sizeToFit.height + 'px'
//   return
// }

// export default LayerImage

import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../constants'

const ImageSource = {
  beginDrag(props, dnd, element) {
    // console.log('props of layer')
    // console.log(props, dnd, element)
    return { id: props.id, coords: props.coords }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    // connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

export class LayerImage extends Component {
  render() {
    const { connectDragSource, isDragging, coords } = this.props
    let width = this.props.sizeToFit.width + 'px'
    let height = this.props.sizeToFit.height + 'px'
    return connectDragSource(
      <div
        className='single-layer__container image-layer'
        style={{
          width: width,
          height: height,
          top: coords.y,
          left: coords.x,
        }}>
        <img
          src={this.props.content}
          alt=''
          style={{
            width: width,
            height: height,
            visibility: isDragging ? 'hidden' : 'visible',
          }}
        />
      </div>
    )
  }
}

export default DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  LayerImage
)
