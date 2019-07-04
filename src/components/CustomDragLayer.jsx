import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
import ImageDragPreview from './ImageDragPreview'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  // const transform = `translate(${x}px, ${y}px)`

  // return {
  //   transform: transform,
  //   WebkitTransform: transform,
  // }
  return {
    position: 'absolute',
    left: x + 'px',
    top: y + 'px',
  }
}

class CustomDragLayer extends Component {
  render() {
    const { item, isDragging } = this.props

    if (!isDragging) {
      return null
    }
    // console.log(item)
    return (
      <div id='drag-placeholder' style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          <ImageDragPreview content={item.content} size={item.size} />
        </div>
      </div>
    )
  }
}

export default DragLayer(collect)(CustomDragLayer)
