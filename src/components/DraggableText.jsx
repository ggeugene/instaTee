import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  setFocus,
  rotateLayer,
  resizeLayer,
  deleteLayer,
  moveLayer,
  stretchLayer,
} from '../actions'
import LayerText from './LayerText'

class DraggableText extends Component {
  constructor(props) {
    super(props)

    this.layerRef = null
    this.cornersRef = {}

    this.dragCoords = {}
    this.startDragCoords = {}

    this.state = {
      isDragging: false,
    }

    this.dragMouseDown = this.dragMouseDown.bind(this)
    this.dragMouseUp = this.dragMouseUp.bind(this)
    this.dragMouseMove = this.dragMouseMove.bind(this)
    this.deselectAll = this.deselectAll.bind(this)
    this.setLayerFocus = this.setLayerFocus.bind(this)
    this.centerLayer = this.centerLayer.bind(this)
    this.stretchLayer = this.stretchLayer.bind(this)

    this.doPolygonsIntersect = this.doPolygonsIntersect.bind(this)
    this.getElementCoords = this.getElementCoords.bind(this)
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

  componentDidMount() {
    window.addEventListener('mouseup', this.dragMouseUp)
    window.addEventListener('mousemove', this.dragMouseMove)
  }

  render() {
    console.log(this.props)
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
    let className = 'single-layer__container text-layer'
    className += isFocused ? ' focused-layer' : ''

    let element = controls ? (
      <div
        onMouseDown={e => {
          this.setLayerFocus()
          this.dragMouseDown(e)
        }}
        className={className}
        style={{ ...styles, opacity: isFocused ? 1 : 0 }}
        ref={div => (this.layerRef = div)}
        data-id={id}>
        <LayerText content={content} opacity={0.2} properties={props} />
        <div className='transform-layer rotate-layer'>R</div>
        <div className='transform-layer resize-layer'>S</div>
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
        <LayerText content={content} properties={props} back={true} />
      </div>
    )

    return element
  }
}
DraggableText = connect(
  null,
  { setFocus, rotateLayer, resizeLayer, deleteLayer, moveLayer, stretchLayer }
)(DraggableText)

export default DraggableText
