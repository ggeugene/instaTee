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
  const { currentOffset, item, back, area } = props
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  const computedSize = props.item.computedSize
  const { size } = props.item
  let { x, y } = currentOffset

  if (area && !back) {
    const areaRect = area.getBoundingClientRect()
    x =
      x -
      areaRect.left -
      1 -
      (computedSize.width - size.width) / 2 +
      (computedSize.width - size.width) +
      'px'
    y =
      y -
      areaRect.top -
      1 -
      (computedSize.height - size.height) / 2 +
      (computedSize.height - size.height) +
      'px'
  } else {
    x = x + (computedSize.width - size.width) / 2 + 'px'
    y = y + (computedSize.height - size.height) / 2 + 'px'
  }

  return {
    position: 'absolute',
    left: x,
    top: y,
    zIndex: item.zIndex ? item.zIndex + 2000 - 1 : 2200,
    willChange: 'opacity',
  }
}

class CustomDragLayer extends PureComponent {
  render() {
    // console.log(this.props)
    const { item, isDragging, back } = this.props
    if (!isDragging) {
      return null
    }
    const { rotateAngle } = this.props.item
    const layerStyles = {
      position: back ? 'fixed' : 'absolute',
      pointerEvents: 'none',
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
            back={back}
          />
        </div>
      </div>
    )
  }
}

export default DragLayer(collect)(CustomDragLayer)
