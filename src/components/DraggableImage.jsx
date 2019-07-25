import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../constants'
import LayerImage from './LayerImage'
import { getEmptyImage } from 'react-dnd-html5-backend'
import {
  setFocus,
  rotateLayer,
  resizeLayer,
  deleteLayer,
  moveLayer,
} from '../actions'
import { connect } from 'react-redux'

const ImageSource = {
  beginDrag(props, dnd, element) {
    if (!props.isFocused) {
      props.setFocus(props.id)
    }
    const layerRect = element.layerRef.getBoundingClientRect()
    return {
      id: props.id,
      coords: props.coords,
      size: props.size,
      content: props.content,
      rotateAngle: props.rotateAngle,
      zIndex: props.zIndex,
      computedSize: {
        width: layerRect.width,
        height: layerRect.height,
      },
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

class DraggableImage extends Component {
  constructor(props) {
    super(props)

    this.layerRef = null
    this.cornersRef = {}

    this.state = {
      isRotating: false,
      isTransforming: false,
    }

    this.coords = {}
    this.startCoords = {}
    this.startSize = {}
    // this.size = this.props.size || {}
    this.size = {}
    // this.newSize = this.props.size || {}
    this.newSize = this.props.size

    this.currentAngle = this.props.rotateAngle.degree
    this.boxCenterPoint = {}
    this.angle = this.props.rotateAngle.degree
    this.startAngle = 0

    this.getPositionFromCenter = this.getPositionFromCenter.bind(this)
    this.rotateMouseDown = this.rotateMouseDown.bind(this)
    this.rotateMouseUp = this.rotateMouseUp.bind(this)
    this.rotateMouseMove = this.rotateMouseMove.bind(this)
    this.deselectAll = this.deselectAll.bind(this)
    this.setLayerFocus = this.setLayerFocus.bind(this)
    this.centerLayer = this.centerLayer.bind(this)

    this.transformMouseDown = this.transformMouseDown.bind(this)
    this.transformMouseUp = this.transformMouseUp.bind(this)
    this.transformMouseMove = this.transformMouseMove.bind(this)

    this.respectAspectRatio = this.respectAspectRatio.bind(this)
    this.setMinSize = this.setMinSize.bind(this)

    this.getElementCoords = this.getElementCoords.bind(this)
    this.doPolygonsIntersect = this.doPolygonsIntersect.bind(this)
  }

  setLayerFocus() {
    if (!this.props.isFocused) {
      this.props.setFocus(this.props.id)
    }
  }

  deselectAll() {
    if (document.selection) {
      document.selection.empty()
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }
  }

  getPositionFromCenter(e) {
    const fromBoxCenter = {
      x: e.clientX - this.boxCenterPoint.x,
      y: e.clientY - this.boxCenterPoint.y,
    }
    return fromBoxCenter
  }

  centerLayer() {
    const { size, moveLayer } = this.props
    const areaRect = this.props.area.getBoundingClientRect()

    const areaCenter = {
      x: (areaRect.width - 2) / 2,
      y: (areaRect.height - 2) / 2,
    }

    const newCoords = {
      x: areaCenter.x - size.width / 2,
      y: areaCenter.y - size.height / 2,
    }

    moveLayer(this.props.id, newCoords)
  }

  rotateMouseDown(e) {
    e.persist()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.setState(
      state => {
        return {
          ...state,
          isRotating: true,
        }
      },
      () => {
        const boxPosition = this.layerRef.getBoundingClientRect()

        this.boxCenterPoint.x = boxPosition.left + boxPosition.width / 2
        this.boxCenterPoint.y = boxPosition.top + boxPosition.height / 2

        const fromBoxCenter = this.getPositionFromCenter(e)
        this.startAngle =
          Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
      }
    )
  }

  rotateMouseUp(e) {
    e.stopPropagation()
    this.deselectAll()
    if (this.state.isRotating) {
      this.setState(
        state => {
          return {
            ...state,
            isRotating: false,
          }
        },
        () => {
          this.currentAngle = this.angle
          const angle = {
            degree: this.angle,
            radian: (this.angle * Math.PI) / 180,
          }
          if (this.props.rotateAngle.degree !== angle.degree) {
            this.currentAngle = this.props.rotateAngle.degree
            const layerCoords = this.getElementCoords(
              this.layerRef,
              angle.degree
            )
            const areaCoords = this.getElementCoords(this.props.area, 0)
            if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
              // console.log(object)
              // let img = document.querySelector(
              //   `.back-area [data-id="${this.props.id}"]`
              // )
              // img.style.transform = `rotate(${
              //   this.props.rotateAngle.degree
              // }deg)`
              this.layerRef.style.transform = `rotate(${
                this.props.rotateAngle.degree
              }deg)`
            } else {
              this.currentAngle = this.angle
              this.props.rotateLayer(this.props.id, angle)
            }
          }
        }
      )
    }
  }

  rotateMouseMove(e) {
    if (this.state.isRotating) {
      const fromBoxCenter = this.getPositionFromCenter(e)
      const newAngle = Math.atan2(fromBoxCenter.y, fromBoxCenter.x)
      const newAngleDegree = newAngle * (180 / Math.PI)
      const newRotateAngle =
        this.currentAngle +
        (newAngleDegree - (this.startAngle ? this.startAngle : 0))
      let img = document.querySelector(
        `.back-area [data-id="${this.props.id}"]`
      )
      img.style.transform = `rotate(${newRotateAngle}deg)`
      this.layerRef.style.transform = `rotate(${newRotateAngle}deg)`
      this.angle = newRotateAngle
    }
  }

  transformMouseDown(e) {
    // e.persist()
    e.stopPropagation()
    // e.nativeEvent.stopImmediatePropagation()

    this.setState(
      state => {
        return {
          ...state,
          isTransforming: true,
        }
      },
      () => {
        this.coords = { ...this.props.coords }
        this.startCoords = { ...this.props.coords }
        this.startSize = { ...this.props.size }
      }
    )
  }

  transformMouseUp(e) {
    this.deselectAll()
    e.stopPropagation()
    if (this.state.isTransforming) {
      const { id, resizeLayer, size } = this.props
      if (
        this.newSize.width !== size.width ||
        this.newSize.height !== size.height
      ) {
        const layerCoords = this.getElementCoords(
          this.layerRef,
          this.props.rotateAngle.degree
        )
        const areaCoords = this.getElementCoords(this.props.area, 0)
        if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
          this.layerRef.style.width = this.startSize.width + 'px'
          this.layerRef.style.height = this.startSize.height + 'px'
          this.layerRef.style.top = this.startCoords.y + 'px'
          this.layerRef.style.left = this.startCoords.x + 'px'
        } else {
          resizeLayer(id, this.newSize, this.coords)
        }
      }
      this.setState(state => {
        return {
          ...state,
          isTransforming: false,
        }
      })
    }
  }

  transformMouseMove(e) {
    this.deselectAll()
    if (this.state.isTransforming) {
      const minSize = 30
      const delta_x_global = e.movementX
      const delta_y_global = e.movementY

      let currentRotation = this.props.rotateAngle.radian

      const delta_mouse = Math.sqrt(
        Math.pow(delta_x_global, 2) + Math.pow(delta_y_global, 2)
      )

      const theta_global = Math.atan2(delta_y_global, delta_x_global)
      const theta_local = currentRotation - theta_global

      const delta_x_local = Math.cos(theta_local) * delta_mouse
      const delta_y_local = -Math.sin(theta_local) * delta_mouse

      if (currentRotation !== 0) {
        const layerStyles = getComputedStyle(this.layerRef)
        this.size.width = parseFloat(layerStyles.width)
        this.size.height = parseFloat(layerStyles.height)
      } else {
        const layerPosition = this.layerRef.getBoundingClientRect()
        this.size.width = layerPosition.width
        this.size.height = layerPosition.height
      }

      this.newSize.width =
        this.size.width + delta_x_local * 2 < minSize
          ? minSize
          : this.size.width + delta_x_local * 2
      this.newSize.height =
        this.size.height + delta_y_local * 2 < minSize
          ? minSize
          : this.size.height + delta_y_local * 2
      this.newSize = this.respectAspectRatio(
        this.props.originalSize,
        this.newSize,
        {
          x: delta_x_local,
          y: delta_y_local,
        }
      )
      this.newSize = this.setMinSize(
        this.props.originalSize,
        this.newSize,
        minSize
      )

      this.coords.x = this.coords.x - (this.newSize.width - this.size.width) / 2
      this.coords.y =
        this.coords.y - (this.newSize.height - this.size.height) / 2

      this.layerRef.style.width = this.newSize.width + 'px'
      this.layerRef.style.height = this.newSize.height + 'px'
      this.layerRef.style.top = this.coords.y + 'px'
      this.layerRef.style.left = this.coords.x + 'px'
    }
  }

  respectAspectRatio(originalSize, newSize, coords) {
    let newImageSize = {
      width: newSize.width,
      height: newSize.height,
    }
    const originalAspectRation = originalSize.width / originalSize.height
    const newAspectRation = newSize.width / newSize.height

    if (newAspectRation !== originalAspectRation) {
      if (Math.abs(coords.x) > Math.abs(coords.y)) {
        newImageSize.height =
          newImageSize.width / (originalSize.width / originalSize.height)
      } else if (Math.abs(coords.x) < Math.abs(coords.y)) {
        newImageSize.width =
          (originalSize.width / originalSize.height) * newSize.height
      }
    }
    return newImageSize
  }

  setMinSize(originalSize, currentSize, minSize) {
    if (currentSize.width < minSize) {
      currentSize.width = minSize
      currentSize.height =
        currentSize.height / (originalSize.width / originalSize.height)
    } else if (currentSize.height < minSize) {
      currentSize.height = minSize
      currentSize.width =
        (originalSize.width / originalSize.height) * currentSize.height
    }
    return currentSize
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

  doPolygonsIntersect(a, b) {
    let polygons = [a, b]
    let minA, maxA, projected, i, i1, j, minB, maxB

    for (i = 0; i < polygons.length; i++) {
      // for each polygon, look at each edge of the polygon, and determine if it separates
      // the two shapes
      let polygon = polygons[i]
      for (i1 = 0; i1 < polygon.length; i1++) {
        // grab 2 vertices to create an edge
        let i2 = (i1 + 1) % polygon.length
        let p1 = polygon[i1]
        let p2 = polygon[i2]

        // find the line perpendicular to this edge
        let normal = { x: p2.y - p1.y, y: p1.x - p2.x }

        minA = maxA = undefined
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < a.length; j++) {
          projected = normal.x * a[j].x + normal.y * a[j].y
          if (minA === undefined || projected < minA) {
            minA = projected
          }
          if (maxA === undefined || projected > maxA) {
            maxA = projected
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined
        for (j = 0; j < b.length; j++) {
          projected = normal.x * b[j].x + normal.y * b[j].y
          if (minB === undefined || projected < minB) {
            minB = projected
          }
          if (maxB === undefined || projected > maxB) {
            maxB = projected
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // polygons, and we know there is no overlap
        if (maxA < minB || maxB < minA) {
          console.log("polygons don't intersect!")
          return false
        }
      }
    }
    console.log('intersect!')
    return true
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.rotateMouseUp)
    window.addEventListener('mousemove', this.rotateMouseMove)

    window.addEventListener('mouseup', this.transformMouseUp)
    window.addEventListener('mousemove', this.transformMouseMove)

    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }
  }
  componentDidUpdate() {
    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }
  }

  render() {
    const {
      id,
      connectDragSource,
      isDragging,
      coords,
      size,
      content,
      zIndex,
      rotateAngle,
      isFocused,
      controls,
    } = this.props

    let styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      top: coords.y + 'px',
      left: coords.x + 'px',
      opacity: isDragging || !isFocused ? 0 : 1,
      zIndex: isFocused ? zIndex + 2000 : zIndex,
      position: 'absolute',
      transform: `rotate(${rotateAngle.degree}deg)`,
    }
    let className = 'single-layer__container image-layer'
    className += isFocused ? ' focused-layer' : ''

    let element = controls ? (
      <div
        className={className}
        style={styles}
        onMouseDown={this.setLayerFocus}
        ref={div => (this.layerRef = div)}
        data-id={id}>
        <LayerImage content={content} opacity={0.2} />
        <div
          className='transform-layer rotate-layer'
          onMouseDown={this.rotateMouseDown}
          onMouseUp={this.rotateMouseUp}>
          R
        </div>
        <div
          className='transform-layer resize-layer'
          onMouseDown={this.transformMouseDown}
          onMouseUp={this.transformMouseUp}>
          S
        </div>
        <div
          className='transform-layer delete-layer'
          onClick={() =>
            this.props.deleteLayer(this.props.id, this.props.fileName)
          }>
          D
        </div>
        <div
          className='transform-layer center-layer'
          onClick={this.centerLayer}>
          C
        </div>
        <div className='corners'>
          <div
            className='corner top-left'
            ref={div => (this.cornersRef.topLeft = div)}
          />
          <div
            className='corner top-right'
            ref={div => (this.cornersRef.topRight = div)}
          />
          <div
            className='corner bottom-right'
            ref={div => (this.cornersRef.bottomRight = div)}
          />
          <div
            className='corner bottom-left'
            ref={div => (this.cornersRef.bottomLeft = div)}
          />
        </div>
      </div>
    ) : (
      <div
        className={className}
        style={{ ...styles, opacity: isDragging ? 0 : 1 }}
        ref={div => (this.layerRef = div)}
        data-id={id}>
        <LayerImage content={content} />
      </div>
    )

    return this.state.isRotating || this.state.isTransforming
      ? element
      : connectDragSource(element)
  }
}

// const mapStateToProps = state => ({ images: state })

DraggableImage = DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  DraggableImage
)

DraggableImage = connect(
  null,
  { setFocus, rotateLayer, resizeLayer, deleteLayer, moveLayer }
)(DraggableImage)

export default DraggableImage
