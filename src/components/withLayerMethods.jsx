import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  setFocus,
  rotateLayer,
  resizeLayer,
  deleteLayer,
  moveLayer,
  stretchLayer,
  resizeText,
} from '../actions'

function withLayerMethods(WrappedComponent) {
  class WithLayerMethods extends Component {
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
      this.newSize = { ...this.props.size }
      this.dragCoords = {}
      this.startDragCoords = {}
      this.prevMouseCoords = {}

      this.fontSize = this.props.props.fontSize

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

      this.transformMouseDown = this.transformMouseDown.bind(this)
      this.transformMouseUp = this.transformMouseUp.bind(this)
      this.transformMouseMove = this.transformMouseMove.bind(this)

      this.dragMouseDown = this.dragMouseDown.bind(this)
      this.dragMouseUp = this.dragMouseUp.bind(this)
      this.dragMouseMove = this.dragMouseMove.bind(this)
      this.keyDownLayerMove = this.keyDownLayerMove.bind(this)
      this.keyUpLayerMove = this.keyUpLayerMove.bind(this)

      this.respectAspectRatio = this.respectAspectRatio.bind(this)
      this.setMinSize = this.setMinSize.bind(this)
      this.setMaxSize = this.setMaxSize.bind(this)

      this.getElementCoords = this.getElementCoords.bind(this)
      this.doPolygonsIntersect = this.doPolygonsIntersect.bind(this)

      this.setLayerRef = this.setLayerRef.bind(this)
      this.setCornerRef = this.setCornerRef.bind(this)
    }

    setLayerRef(ref) {
      this.layerRef = ref
    }

    setCornerRef(corner, ref) {
      this.cornersRef[corner] = ref
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

    setLayerFocus() {
      if (!this.props.isFocused) {
        this.props.setFocus(this.props.id)
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
          newImageSize.height = newImageSize.width / (originalSize.width / originalSize.height)
        } else if (Math.abs(coords.x) < Math.abs(coords.y)) {
          newImageSize.width = (originalSize.width / originalSize.height) * newSize.height
        }
      }
      if (newImageSize.width > originalSize.width || newImageSize.height > originalSize.height)
        newImageSize = this.setMaxSize(originalSize, newImageSize)
      return newImageSize
    }

    setMinSize(originalSize, currentSize, minSize) {
      if (currentSize.width < minSize) {
        currentSize.width = minSize
        currentSize.height = currentSize.height / (originalSize.width / originalSize.height)
      } else if (currentSize.height < minSize) {
        currentSize.height = minSize
        currentSize.width = (originalSize.width / originalSize.height) * currentSize.height
      }
      return currentSize
    }

    setMaxSize(originalSize, currentSize) {
      currentSize.width = originalSize.width
      currentSize.height = originalSize.height
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

      const pointsArray = [rotatedTopLeft, rotatedTopRight, rotatedBottomRight, rotatedBottomLeft]
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
          this.startAngle = Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
        }
      )
    }

    rotateMouseUp(e) {
      if (this.state.isRotating) {
        this.deselectAll()
        e.stopPropagation()
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
            let img = document.querySelector(`.back-area [data-id="${this.props.id}"]`)
            img.style.transform = `rotate(${this.props.rotateAngle.degree}deg)`
            this.layerRef.style.transform = `rotate(${this.props.rotateAngle.degree}deg)`
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
        this.deselectAll()
        const fromBoxCenter = this.getPositionFromCenter(e)
        const newAngle = Math.atan2(fromBoxCenter.y, fromBoxCenter.x)
        const newAngleDegree = newAngle * (180 / Math.PI)
        const newRotateAngle =
          this.currentAngle + (newAngleDegree - (this.startAngle ? this.startAngle : 0))
        let img = document.querySelector(`.back-area [data-id="${this.props.id}"]`)
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
          const { type } = this.props
          if (type === 'text') {
            this.fontSize = this.props.props.fontSize
          }
          this.coords = { ...this.props.coords }
          this.startCoords = { ...this.props.coords }
          this.startSize = { ...this.props.size }
        }
      )
    }

    transformMouseUp(e) {
      if (this.state.isTransforming) {
        this.deselectAll()
        e.stopPropagation()
        const { id, resizeLayer, size, type, resizeText } = this.props
        if (
          this.newSize.width !== size.width ||
          this.newSize.height !== size.height ||
          type === 'text'
        ) {
          const layerCoords = this.getElementCoords(this.layerRef, this.props.rotateAngle.degree)
          const areaCoords = this.getElementCoords(this.props.area, 0)
          if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
            let backLayer = document.querySelector(`.back-area [data-id="${id}"]`)
            if (type === 'image') {
              backLayer.style.width = this.startSize.width + 'px'
              backLayer.style.height = this.startSize.height + 'px'
              this.layerRef.style.width = this.startSize.width + 'px'
              this.layerRef.style.height = this.startSize.height + 'px'
            }

            backLayer.style.top = this.startCoords.y + 'px'
            backLayer.style.left = this.startCoords.x + 'px'
            this.layerRef.style.top = this.startCoords.y + 'px'
            this.layerRef.style.left = this.startCoords.x + 'px'
          } else {
            if (type === 'image') {
              resizeLayer(id, this.newSize, this.coords)
            } else if (type === 'text') {
              resizeText(id, this.fontSize, this.coords)
            }
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
      if (this.state.isTransforming) {
        this.deselectAll()
        const { type, originalSize } = this.props
        const delta_x_global = e.screenX - this.prevMouseCoords.x
        const delta_y_global = e.screenY - this.prevMouseCoords.y

        let currentRotation = this.props.rotateAngle.radian

        const delta_mouse = Math.sqrt(Math.pow(delta_x_global, 2) + Math.pow(delta_y_global, 2))

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

        let backLayer = document.querySelector(`.back-area [data-id="${this.props.id}"]`)

        if (type === 'image') {
          const minImageSize = 30
          this.newSize.width =
            this.size.width + delta_x_local < minImageSize
              ? minImageSize
              : this.size.width + delta_x_local
          this.newSize.height =
            this.size.height + delta_y_local < minImageSize
              ? minImageSize
              : this.size.height + delta_y_local
          this.newSize = this.respectAspectRatio(originalSize, this.newSize, {
            x: delta_x_local,
            y: delta_y_local,
          })
          this.newSize = this.setMinSize(originalSize, this.newSize, minImageSize)
        } else if (type === 'text') {
          const minTextSize = 6
          const maxTextSize = 300
          const fontSize = parseFloat(getComputedStyle(this.layerRef).fontSize)
          this.fontSize =
            Math.abs(delta_x_local) <= Math.abs(delta_y_local)
              ? fontSize + delta_y_local
              : fontSize + delta_x_local / 2
          if (this.fontSize < minTextSize) this.fontSize = minTextSize
          if (this.fontSize > maxTextSize) this.fontSize = maxTextSize

          let textSizeInput = document.getElementById('text-size')
          if (textSizeInput) {
            textSizeInput.value = this.fontSize
          }
          this.layerRef.style.fontSize = this.fontSize + 'px'
          backLayer.style.fontSize = this.fontSize + 'px'

          if (currentRotation !== 0) {
            const layerStyles = getComputedStyle(this.layerRef)
            this.newSize.width = parseFloat(layerStyles.width)
            this.newSize.height = parseFloat(layerStyles.height)
          } else {
            const layerPosition = this.layerRef.getBoundingClientRect()
            this.newSize.width = layerPosition.width
            this.newSize.height = layerPosition.height
          }
        }

        this.coords.x = this.coords.x - (this.newSize.width - this.size.width) / 2
        this.coords.y = this.coords.y - (this.newSize.height - this.size.height) / 2

        if (type === 'image') {
          this.layerRef.style.width = this.newSize.width + 'px'
          this.layerRef.style.height = this.newSize.height + 'px'
          backLayer.style.width = this.newSize.width + 'px'
          backLayer.style.height = this.newSize.height + 'px'
        }

        this.layerRef.style.top = this.coords.y + 'px'
        this.layerRef.style.left = this.coords.x + 'px'

        backLayer.style.top = this.coords.y + 'px'
        backLayer.style.left = this.coords.x + 'px'
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
      if (this.state.isDragging) {
        e.stopPropagation()
        e.preventDefault()
        const { moveLayer, id, coords } = this.props
        const layerCoords = this.getElementCoords(this.layerRef, this.props.rotateAngle.degree)
        const areaCoords = this.getElementCoords(this.props.area, 0)
        if (!this.doPolygonsIntersect(layerCoords, areaCoords)) {
          let noOverflowLayer = document.querySelector(`.no-overflow [data-id="${id}"]`)
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

    keyDownLayerMove(e) {
      const inputs = document.querySelectorAll('.text-settings textarea, .text-settings input')
      let focused = false
      inputs.forEach(input => {
        if (input === document.activeElement) focused = true
      })
      const { coords, isFocused } = this.props
      if (isFocused && !focused) {
        this.dragCoords = { ...coords }
        switch (e.key) {
          case 'ArrowUp':
            this.dragCoords.y = coords.y--
            break
          case 'ArrowRight':
            this.dragCoords.x = coords.x++
            break
          case 'ArrowDown':
            this.dragCoords.y = coords.y++
            break
          case 'ArrowLeft':
            this.dragCoords.x = coords.x--
            break
          default:
            break
        }
        let layerImages = document.querySelectorAll('.focused-layer')
        layerImages.forEach(layer => {
          layer.style.top = this.dragCoords.y + 'px'
          layer.style.left = this.dragCoords.x + 'px'
        })
      }
    }
    keyUpLayerMove(e) {
      const { moveLayer, id, isFocused } = this.props
      const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
      const inputs = document.querySelectorAll('.text-settings textarea, .text-settings input')
      let focused = false
      inputs.forEach(input => {
        if (input === document.activeElement) focused = true
      })
      if (isFocused && keys.includes(e.key) && !focused) {
        moveLayer(id, this.dragCoords)
      }
    }

    componentDidMount() {
      window.addEventListener('mouseup', this.rotateMouseUp)
      window.addEventListener('mousemove', this.rotateMouseMove)
      window.addEventListener('mouseup', this.transformMouseUp)
      window.addEventListener('mousemove', this.transformMouseMove)
      window.addEventListener('mouseup', this.dragMouseUp)
      window.addEventListener('mousemove', this.dragMouseMove)
      window.addEventListener('keyup', this.keyUpLayerMove)
      window.addEventListener('keydown', this.keyDownLayerMove)
    }

    componentWillUnmount() {
      window.removeEventListener('mouseup', this.rotateMouseUp)
      window.removeEventListener('mousemove', this.rotateMouseMove)
      window.removeEventListener('mouseup', this.transformMouseUp)
      window.removeEventListener('mousemove', this.transformMouseMove)
      window.removeEventListener('mouseup', this.dragMouseUp)
      window.removeEventListener('mousemove', this.dragMouseMove)
      window.removeEventListener('keyup', this.keyUpLayerMove)
      window.removeEventListener('keydown', this.keyDownLayerMove)
    }

    componentDidUpdate() {
      const { size, type } = this.props
      if (type === 'text') {
        this.layerRef.style.width = size.width
        this.layerRef.style.height = size.height
      }
    }

    render() {
      const { deleteLayer, ...rest } = this.props

      return (
        <WrappedComponent
          hocMethods={{
            rotateMouseDown: this.rotateMouseDown,
            rotateMouseUp: this.rotateMouseUp,
            transformMouseDown: this.transformMouseDown,
            transformMouseUp: this.transformMouseUp,
            dragMouseDown: this.dragMouseDown,
            dragMouseUp: this.dragMouseUp,
            deleteLayer: deleteLayer,
            setLayerFocus: this.setLayerFocus,
          }}
          setLayerRef={this.setLayerRef}
          setCornerRef={this.setCornerRef}
          {...rest}
        />
      )
    }
  }
  return WithLayerMethods
}

const mapDispatchToProps = dispatch => ({
  setFocus: id => dispatch(setFocus(id)),
  rotateLayer: (id, rotateAngle) => dispatch(rotateLayer(id, rotateAngle)),
  resizeLayer: (id, newSize, newCoords) => dispatch(resizeLayer(id, newSize, newCoords)),
  deleteLayer: id => dispatch(deleteLayer(id)),
  moveLayer: (id, coords) => dispatch(moveLayer(id, coords)),
  stretchLayer: (id, size, coords) => dispatch(stretchLayer(id, size, coords)),
  resizeText: (id, fontSize, coords) => dispatch(resizeText(id, fontSize, coords)),
})

const composedWrapper = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withLayerMethods
)

export default composedWrapper
