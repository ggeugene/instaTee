import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
import ImageDragPreview from './ImageDragPreview'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  // width: '100%',
  // height: '100%',
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

// function getItemCoords(props) {
//   const { currentOffset } = props
//   if (!currentOffset) {
//     return {
//       x: 0,
//       y: 0,
//     }
//   }
//   return currentOffset
// }

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  // return { ...layerStyles, left: x + 'px', top: y + 'px' }
  return {
    transform,
    WebkitTransform: transform,
  }
}

class CustomDragLayer extends Component {
  render() {
    const { item, isDragging } = this.props

    if (!isDragging) {
      return null
    }

    return (
      <div id='drag-placeholder' style={layerStyles}>
        {/* <div style={getItemStyles(this.props)}>PREVIEW</div> */}
        <div style={getItemStyles(this.props)}>
          <ImageDragPreview
            content={item.content}
            size={item.size}
            // coords={getItemCoords(this.props)}
          />
        </div>
      </div>
    )
  }
}

export default DragLayer(collect)(CustomDragLayer)
