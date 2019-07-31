import React, { PureComponent } from 'react'
import { DragLayer } from 'react-dnd'
import ImageDragPreview from './ImageDragPreview'
import { connect } from 'react-redux'
import { setIntersection } from '../actions'

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

function getItemStyles(props, ref = {}) {
  console.log(props)
  const { currentOffset, item, back, area } = props
  // if (!currentOffset) {
  //   return {
  //     display: 'none',
  //   }
  // }
  const computedSize = props.item.computedSize
  const { size } = props.item
  let { x, y } = currentOffset
  const areaRect = area.getBoundingClientRect()

  if (!back) {
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
  constructor(props) {
    super(props)
    this.cornersRef = {}
    this.setCornerRef = this.setCornerRef.bind(this)
    this.setImageRef = this.setImageRef.bind(this)
    this.getElementCoords = this.getElementCoords.bind(this)
    this.setIntersectiontoStore = this.setIntersectiontoStore.bind(this)
    this.imageRef = null
    this.cachedCurrentOffset = undefined
  }

  setCornerRef(ref, name) {
    this.cornersRef[name] = ref
  }

  setImageRef(ref) {
    this.imageRef = ref
  }

  getElementCoords(element, angle) {
    const elementRect = element.getBoundingClientRect()
    let rotatedTopLeft, rotatedTopRight, rotatedBottomRight, rotatedBottomLeft

    if (angle !== 0) {
      const topLeftRect = this.cornersRef.topLeft.getBoundingClientRect()
      rotatedTopLeft = {
        y: topLeftRect.top,
        x: topLeftRect.left,
      }
      const topRightRect = this.cornersRef.topRight.getBoundingClientRect()
      rotatedTopRight = {
        y: topRightRect.top,
        x: topRightRect.left,
      }
      const bottomRightRect = this.cornersRef.bottomRight.getBoundingClientRect()
      rotatedBottomRight = {
        y: bottomRightRect.top,
        x: bottomRightRect.left,
      }
      const bottomLeftRect = this.cornersRef.bottomLeft.getBoundingClientRect()
      rotatedBottomLeft = {
        y: bottomLeftRect.top,
        x: bottomLeftRect.left,
      }
    } else {
      rotatedTopLeft = {
        y: elementRect.top,
        x: elementRect.left,
      }
      rotatedTopRight = {
        y: elementRect.top,
        x: elementRect.left + elementRect.width,
      }
      rotatedBottomRight = {
        y: elementRect.top + elementRect.height,
        x: elementRect.left + elementRect.width,
      }
      rotatedBottomLeft = {
        y: elementRect.top + elementRect.height,
        x: elementRect.left,
      }
    }

    const pointsArray = [
      rotatedTopLeft,
      rotatedTopRight,
      rotatedBottomRight,
      rotatedBottomLeft,
    ]
    return pointsArray
  }

  setIntersectiontoStore() {
    const { area, setIntersection, doIntersect, intersectState } = this.props
    let areaCoords = this.getElementCoords(area, 0)
    let layerCoords = this.getElementCoords(
      this.imageRef,
      this.props.item.rotateAngle.radian
    )
    let intersect = doIntersect(layerCoords, areaCoords)
    if (intersectState !== intersect) setIntersection(intersect)
  }

  render() {
    const { item, isDragging, back } = this.props

    if (!isDragging || this.props.currentOffset !== null) {
      this.cachedCurrentOffset = this.props.currentOffset
    }

    const newProps = Object.assign({}, this.props, {
      currentOffset: this.cachedCurrentOffset,
    })

    if (!isDragging) {
      return null
    }

    if (this.dragRef) {
      this.setIntersectiontoStore()
    }
    const { rotateAngle } = this.props.item
    const layerStyles = {
      position: back ? 'fixed' : 'absolute',
      pointerEvents: 'none',
      left: 0,
      top: 0,
    }

    return back ? (
      <div id='drag-placeholder' style={layerStyles}>
        <div style={getItemStyles(newProps, this.cornersRef)}>
          <ImageDragPreview
            content={item.content}
            size={item.size}
            rotateAngle={rotateAngle}
            back={back}
            setCornerRef={this.setCornerRef}
            setImageRef={this.setImageRef}
            ref={div => (this.dragRef = div)}
          />
        </div>
      </div>
    ) : (
      <div id='drag-placeholder' style={layerStyles}>
        <div style={getItemStyles(newProps)}>
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

CustomDragLayer = DragLayer(collect)(CustomDragLayer)
CustomDragLayer = connect(
  null,
  { setIntersection }
)(CustomDragLayer)
export default CustomDragLayer
