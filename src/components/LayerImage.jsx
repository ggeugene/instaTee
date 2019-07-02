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
import { getEmptyImage } from 'react-dnd-html5-backend'

const ImageSource = {
  beginDrag(props, dnd, element) {
    return {
      id: props.id,
      coords: props.coords,
      size: props.size,
      content: props.content,
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class LayerImage extends Component {
  componentDidMount() {
    const { connectDragPreview } = this.props
    // console.log(connectDragPreview)
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }

  render() {
    // console.log(this.props)
    const { connectDragSource, isDragging, coords, sizeToFit } = this.props
    let width = sizeToFit.width + 'px'
    let height = sizeToFit.height + 'px'
    return connectDragSource(
      <div
        className='single-layer__container image-layer'
        style={{
          width: width,
          height: isDragging ? 0 : height,
          top: isDragging ? 'initial' : coords.y + 'px',
          left: isDragging ? 'initial' : coords.x + 'px',
          opacity: isDragging ? 0 : 1,
          display: 'inline-block',
          position: isDragging ? 'static' : 'absolute',
        }}>
        <img
          src={this.props.content}
          alt=''
          style={{
            width: width,
            height: height,
            // visibility: isDragging ? 'hidden' : 'visible',
          }}
        />
      </div>
    )
  }
}

export default DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  LayerImage
)
