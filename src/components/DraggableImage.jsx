import React, { Component } from 'react'
// import { DragSource } from 'react-dnd'
// import { ItemTypes } from '../constants'
import LayerImage from './LayerImage'
// import { getEmptyImage } from 'react-dnd-html5-backend'
import {
  setFocus,
  rotateLayer,
  resizeLayer,
  deleteLayer,
  moveLayer,
  stretchLayer,
} from '../actions'
import { connect } from 'react-redux'

class DraggableImage extends Component {
  constructor(props) {
    super(props)

    this.layerRef = null
    this.cornersRef = {}

    this.state = {
      isRotating: false,
      isTransforming: false,
      isDragging: false,
    }

    this.coords = {}
    this.startCoords = {}
    this.startSize = {}
    this.size = {}
    this.newSize = this.props.size
    this.dragCoords = {}
    this.startDragCoords = {}
    this.prevMouseCoords = {}

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
    this.stretchLayer = this.stretchLayer.bind(this)

    this.transformMouseDown = this.transformMouseDown.bind(this)
    this.transformMouseUp = this.transformMouseUp.bind(this)
    this.transformMouseMove = this.transformMouseMove.bind(this)

    this.dragMouseDown = this.dragMouseDown.bind(this)
    this.dragMouseUp = this.dragMouseUp.bind(this)
    this.dragMouseMove = this.dragMouseMove.bind(this)

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
      this.currentAngle = this.angle
      const angle = {
        degree: this.angle,
        radian: (this.angle * Math.PI) / 180,
      }
      if (this.props.rotateAngle.degree !== angle.degree) {
        this.currentAngle = this.props.rotateAngle.degree
        const layerCoords = this.getElementCoords(this.layerRef, angle.degree)
        const areaCoords = this.getElementCoords(this.props.area, 0)
        if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
          let img = document.querySelector(
            `.back-area [data-id="${this.props.id}"]`
          )
          img.style.transform = `rotate(${this.props.rotateAngle.degree}deg)`
          this.layerRef.style.transform = `rotate(${
            this.props.rotateAngle.degree
          }deg)`
        } else {
          this.currentAngle = this.angle
          this.props.rotateLayer(this.props.id, angle)
        }
      }
      this.setState(state => {
        return {
          ...state,
          isRotating: false,
        }
      })
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
    e.stopPropagation()

    this.prevMouseCoords.x = e.screenX
    this.prevMouseCoords.y = e.screenY

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
    e.stopPropagation()
    this.deselectAll()
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
          let img = document.querySelector(
            `.back-area [data-id="${this.props.id}"]`
          )
          img.style.width = this.startSize.width + 'px'
          img.style.height = this.startSize.height + 'px'
          img.style.top = this.startCoords.y + 'px'
          img.style.left = this.startCoords.x + 'px'

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
      const delta_x_global = e.screenX - this.prevMouseCoords.x
      const delta_y_global = e.screenY - this.prevMouseCoords.y

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
        this.size.width + delta_x_local < minSize
          ? minSize
          : this.size.width + delta_x_local
      this.newSize.height =
        this.size.height + delta_y_local < minSize
          ? minSize
          : this.size.height + delta_y_local
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

      let img = document.querySelector(
        `.back-area [data-id="${this.props.id}"]`
      )
      img.style.width = this.newSize.width + 'px'
      img.style.height = this.newSize.height + 'px'
      img.style.top = this.coords.y + 'px'
      img.style.left = this.coords.x + 'px'
    }
    this.prevMouseCoords.x = e.screenX
    this.prevMouseCoords.y = e.screenY
  }

  dragMouseDown(e) {
    e.stopPropagation()
    e.preventDefault()

    if (e.button !== 0 || e.target.classList.contains('transform-layer')) return

    const { coords } = this.props
    this.startDragCoords = { x: e.pageX, y: e.pageY }
    this.dragCoords = { ...coords }
    this.setState(state => {
      return {
        ...state,
        isDragging: true,
      }
    })
  }

  dragMouseUp(e) {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.isDragging) {
      const { moveLayer, id, coords } = this.props
      const layerCoords = this.getElementCoords(
        this.layerRef,
        this.props.rotateAngle.degree
      )
      const areaCoords = this.getElementCoords(this.props.area, 0)
      if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
        let noOverflowLayer = document.querySelector(
          `.no-overflow [data-id="${id}"]`
        )
        this.layerRef.style.left = coords.x + 'px'
        this.layerRef.style.top = coords.y + 'px'
        noOverflowLayer.style.left = coords.x + 'px'
        noOverflowLayer.style.top = coords.y + 'px'
      } else {
        if (this.dragCoords.x !== coords.x || this.dragCoords.y !== coords.y) {
          moveLayer(id, this.dragCoords)
        }
      }
      this.setState(
        state => {
          return {
            ...state,
            isDragging: false,
          }
        },
        () => {}
      )
    }
  }
  dragMouseMove(e) {
    if (this.state.isDragging) {
      const { coords } = this.props

      this.dragCoords.x = coords.x + (e.pageX - this.startDragCoords.x)
      this.dragCoords.y = coords.y + (e.pageY - this.startDragCoords.y)

      let layerImages = document.querySelectorAll('.focused-layer')
      layerImages.forEach(layer => {
        layer.style.top = this.dragCoords.y + 'px'
        layer.style.left = this.dragCoords.x + 'px'
      })
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
          // console.log("polygons don't intersect!")
          return false
        }
      }
    }
    // console.log('intersect!')
    return true
  }

  stretchLayer() {
    let { area, size, coords, stretchLayer, id } = this.props
    const borderWidth = 1
    let areaRect = area.getBoundingClientRect()
    let layerRect = this.layerRef.getBoundingClientRect()
    let newSize = Object.assign({}, size)
    let y = coords.y
    let x = coords.x

    // minus 1px border width from left and right
    areaRect.width = areaRect.width - borderWidth * 2
    areaRect.height = areaRect.height - borderWidth * 2

    const ratio = Math.min(
      areaRect.width / layerRect.width,
      areaRect.height / layerRect.height
    )

    newSize.width = newSize.width * ratio
    newSize.height = newSize.height * ratio

    this.layerRef.style.width = newSize.width + 'px'
    this.layerRef.style.height = newSize.height + 'px'

    layerRect = this.layerRef.getBoundingClientRect()

    if (layerRect.left < areaRect.left) {
      x += areaRect.left - layerRect.left + borderWidth
    } else if (
      layerRect.left + layerRect.width >
      areaRect.left + areaRect.width
    ) {
      x -=
        layerRect.left +
        layerRect.width -
        (areaRect.left + areaRect.width) -
        borderWidth
    } else {
      x -= (newSize.width - size.width) / 2

      //TODO: fix as DRY
      this.layerRef.style.left = x + 'px'
      layerRect = this.layerRef.getBoundingClientRect()
      if (layerRect.left < areaRect.left) {
        x += areaRect.left - layerRect.left + borderWidth
      } else if (
        layerRect.left + layerRect.width >
        areaRect.left + areaRect.width
      ) {
        x -=
          layerRect.left +
          layerRect.width -
          areaRect.left -
          areaRect.width -
          borderWidth
      }
    }

    layerRect = this.layerRef.getBoundingClientRect()

    if (layerRect.top < areaRect.top) {
      y += areaRect.top - layerRect.top + borderWidth
    } else if (
      layerRect.top + layerRect.height >
      areaRect.top + areaRect.height
    ) {
      y -=
        layerRect.top +
        layerRect.height -
        areaRect.top -
        areaRect.height -
        borderWidth
    } else {
      y -= (newSize.height - size.height) / 2

      //TODO: fix as DRY
      this.layerRef.style.top = y + 'px'
      layerRect = this.layerRef.getBoundingClientRect()
      if (layerRect.top < areaRect.top) {
        y += areaRect.top - layerRect.top + borderWidth
      } else if (
        layerRect.top + layerRect.height >
        areaRect.top + areaRect.height
      ) {
        y -=
          layerRect.top +
          layerRect.height -
          (areaRect.top + areaRect.height) -
          borderWidth
      }
    }

    stretchLayer(id, newSize, {
      x,
      y,
    })
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.rotateMouseUp)
    window.addEventListener('mousemove', this.rotateMouseMove)

    window.addEventListener('mouseup', this.transformMouseUp)
    window.addEventListener('mousemove', this.transformMouseMove)

    window.addEventListener('mouseup', this.dragMouseUp)
    window.addEventListener('mousemove', this.dragMouseMove)
  }

  render() {
    const {
      id,
      coords,
      size,
      content,
      zIndex,
      rotateAngle,
      isFocused,
      controls,
      props,
    } = this.props

    let styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      top: coords.y + 'px',
      left: coords.x + 'px',
      zIndex: isFocused ? zIndex + 2000 : zIndex,
      position: 'absolute',
      transform: `rotate(${rotateAngle.degree}deg)`,
      willChange: 'opacity',
    }
    let className = 'single-layer__container image-layer'
    className += isFocused ? ' focused-layer' : ''

    let element = controls ? (
      <div
        onMouseDown={e => {
          this.setLayerFocus()
          this.dragMouseDown(e)
        }}
        className={className}
        style={{ ...styles, opacity: isFocused ? 1 : 0 }}
        // onMouseDown={this.setLayerFocus}
        ref={div => (this.layerRef = div)}
        data-id={id}>
        <LayerImage content={content} opacity={0.2} properties={props} />
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
        <div
          className='transform-layer stretch-layer'
          onClick={this.stretchLayer}>
          [ ]
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
        onMouseDown={this.dragMouseDown}
        className={className}
        style={styles}
        ref={div => (this.layerRef = div)}
        data-id={id}>
        <LayerImage content={content} properties={props} back={true} />
      </div>
    )

    return element
  }
}

// const mapStateToProps = state => ({ images: state })

DraggableImage = connect(
  null,
  { setFocus, rotateLayer, resizeLayer, deleteLayer, moveLayer, stretchLayer }
)(DraggableImage)

export default DraggableImage
