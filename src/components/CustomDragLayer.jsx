import React, { PureComponent } from 'react'
import { DragLayer } from 'react-dnd'
import ImageDragPreview from './ImageDragPreview'

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
  const computedSize = props.item.computedSize
  const { size } = props.item
  const { x, y } = currentOffset
  return {
    position: 'absolute',
    left: x + (computedSize.width - size.width) / 2 + 'px',
    top: y + (computedSize.height - size.height) / 2 + 'px',
    transform: `rotate(${props.item.rotateAngle}deg)`,
  }
}

class CustomDragLayer extends PureComponent {
  render() {
    const { item, isDragging } = this.props
    if (!isDragging) {
      return null
    }
    const { rotateAngle } = this.props.item
    const layerStyles = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: item.zIndex ? item.zIndex : 100,
      left: 0,
      top: 0,
    }
    return (
      <div id='drag-placeholder' style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          <ImageDragPreview
            content={item.content}
            size={item.size}
            rotateAngle={rotateAngle}
          />
        </div>
      </div>
    )
  }
}

export default DragLayer(collect)(CustomDragLayer)
