import React, { PureComponent } from 'react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../constants'
import LayerImage from './LayerImage'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { setFocus, rotateLayer, resizeLayer, deleteLayer } from '../actions'
import { connect } from 'react-redux'

const ImageSource = {
  beginDrag(props, dnd, element) {
    if (!props.isFocused) {
      props.setFocus(props.id)
    }
    return {
      id: props.id,
      coords: props.coords,
      size: props.size,
      content: props.content,
      rotateAngle: props.rotateAngle,
      zIndex: props.zIndex,
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

class DraggableImage extends PureComponent {
  constructor(props) {
    super(props)

    this.layerRef = null

    this.state = {
      isRotating: false,
      isTransforming: false,
    }

    this.coords = this.props.coords || {}
    this.size = this.props.size || {}
    this.newSize = this.props.size || {}
    this.startCoords = {}

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

    this.respectAspectRatio = this.respectAspectRatio.bind(this)
    // this.setMinSize = this.setMinSize.bind(this)
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
        // get the current center point
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
            this.props.rotateLayer(this.props.id, angle)
          }
        }
      )
    }
  }

  rotateMouseMove(e) {
    if (this.state.isRotating) {
      const fromBoxCenter = this.getPositionFromCenter(e)
      const newAngle =
        Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI)
      const newRotateAngle =
        this.currentAngle + (newAngle - (this.startAngle ? this.startAngle : 0))
      this.layerRef.style.transform = `rotate(${newRotateAngle}deg)`
      this.angle = newRotateAngle
    }
  }

  transformMouseDown(e) {
    // e.persist()
    e.stopPropagation()
    this.setState(
      state => {
        return {
          ...state,
          isTransforming: true,
        }
      },
      () => (this.coords = this.props.coords)
    )
  }

  transformMouseUp(e) {
    this.deselectAll()
    if (this.state.isTransforming) {
      e.stopPropagation()
      const { id, resizeLayer, size } = this.props
      if (this.size.width !== size.width || this.size.height !== size.height) {
        resizeLayer(id, this.newSize, this.coords)
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

      const currentRotation = this.props.rotateAngle.radian

      const delta_mouse = Math.sqrt(
        Math.pow(delta_x_global, 2) + Math.pow(delta_y_global, 2)
      )

      const theta_global = Math.atan2(delta_y_global, delta_x_global)
      const theta_local = currentRotation - theta_global

      const delta_x_local = Math.cos(theta_local) * delta_mouse
      const delta_y_local = -Math.sin(theta_local) * delta_mouse

      const layerPosition = this.layerRef.getBoundingClientRect()

      if (currentRotation !== 0) {
        this.size.width =
          (layerPosition.width + layerPosition.height) /
            (Math.cos(currentRotation) + Math.sin(currentRotation)) +
          (layerPosition.width - layerPosition.height) /
            (Math.cos(currentRotation) - Math.sin(currentRotation))
        this.size.height =
          (layerPosition.width + layerPosition.height) /
            (Math.cos(currentRotation) + Math.sin(currentRotation)) -
          (layerPosition.width - layerPosition.height) /
            (Math.cos(currentRotation) - Math.sin(currentRotation))
        this.size.width = this.size.width / 2
        this.size.height = this.size.height / 2
      } else {
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

  componentDidMount() {
    window.addEventListener('mouseup', this.rotateMouseUp)
    window.addEventListener('mousemove', this.rotateMouseMove)

    window.addEventListener('mouseup', this.transformMouseUp)
    window.addEventListener('mousemove', this.transformMouseMove)

    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }
  }
  componentDidUpdate() {
    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }
  }

  render() {
    const {
      connectDragSource,
      isDragging,
      coords,
      size,
      content,
      zIndex,
      rotateAngle,
      isFocused,
    } = this.props
    // this.coords = coords
    this.size.width = size.width
    this.size.height = size.height
    let styles = {
      width: size.width + 'px',
      height: size.height + 'px',
      top: coords.y + 'px',
      left: coords.x + 'px',
      opacity: isDragging ? 0 : 1,
      zIndex: zIndex,
      position: 'absolute',
      transform: `rotate(${rotateAngle.degree}deg)`,
    }
    let className = 'single-layer__container image-layer'
    className += isFocused ? ' focused-layer' : ''

    return this.state.isRotating || this.state.isTransforming ? (
      <div
        className={className}
        style={styles}
        onClick={this.setLayerFocus}
        ref={div => (this.layerRef = div)}>
        <LayerImage content={content} />
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
      </div>
    ) : (
      connectDragSource(
        <div className={className} style={styles} onClick={this.setLayerFocus}>
          <LayerImage content={content} />
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
        </div>
      )
    )
  }
}

// const mapStateToProps = state => ({ images: state })

DraggableImage = DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  DraggableImage
)

DraggableImage = connect(
  null,
  { setFocus, rotateLayer, resizeLayer, deleteLayer }
)(DraggableImage)

export default DraggableImage
