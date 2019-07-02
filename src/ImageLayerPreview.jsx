import React, { PureComponent } from 'react'
import { DragLayer } from 'react-dnd'
import LayerImage from './components/LayerImage'

const layerStyles = {
  position: 'fixed',
  display: 'block',
  zIndex: 10000,
  top: 0,
  left: 0,
  cursor: 'move',
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

function getItemCoords(props) {
  const { currentOffset } = props
  // console.log(props)
  if (!currentOffset) {
    return {
      x: 0,
      y: 0,
    }
  }
  return currentOffset
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  // console.log(x, y)
  return { ...layerStyles, left: x + 'px', top: y + 'px' }
}

class ImageLayerPreview extends PureComponent {
  render() {
    const { item, isDragging } = this.props
    let withCoords = {
      ...item,
      coords: getItemCoords(this.props),
    }
    // console.log(withCoords)

    if (!isDragging) {
      return null
    }
    return (
      <div id='drag-placeholder' style={getItemStyles(this.props)}>
        <LayerImage {...withCoords} sizeToFit={item.size} />
        {/* <div>PREVIEW</div> */}
      </div>
    )
  }
}

export default DragLayer(collect)(ImageLayerPreview)
