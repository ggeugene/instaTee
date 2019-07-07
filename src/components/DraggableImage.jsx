import React, { PureComponent } from 'react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../constants'
import LayerImage from './LayerImage'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { setFocus, rotateLayer } from '../actions'
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

    this.isRotating = false
    this.currentAngle = this.props.rotateAngle
    this.boxCenterPoint = {}
    this.angle = this.props.rotateAngle
    this.startAngle = 0
  
    this.getPositionFromCenter = this.getPositionFromCenter.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.setLayerFocus = this.setLayerFocus.bind(this)
  }

  setLayerFocus() {
    if (!this.props.isFocused) {
      this.props.setFocus(this.props.id)
    }
  }

  // to avoid unwanted behaviour, deselect all text
  deselectAll() {
    if (document.selection) {
      document.selection.empty();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // method to get the positionof the pointer event relative to the center of the box
  getPositionFromCenter(e) {
    const fromBoxCenter = {
      x: e.clientX -  this.boxCenterPoint.x,
      y: -(e.clientY -  this.boxCenterPoint.y)
    };
    return fromBoxCenter;
  }

  mouseDownHandler(e) {
    e.stopPropagation();
    const boxPosition = this.layerRef.getBoundingClientRect();
    // get the current center point
    this.boxCenterPoint.x = boxPosition.left + boxPosition.width / 2;
    this.boxCenterPoint.y = boxPosition.top + boxPosition.height / 2;
    
    this.startAngle = this.props.rotateAngle
    console.log(this.props.rotateAngle)
    this.isRotating = true
  }

  mouseUpHandler(e) {
    this.deselectAll();
    e.stopPropagation();
    if (this.isRotating) {
      const newCurrentAngle = this.currentAngle + (this.angle - this.startAngle);
      this.isRotating = false
      this.currentAngle = newCurrentAngle
      console.log(this.currentAngle)
    }
  }

  mouseMoveHandler(e) {
    if (this.isRotating) {
      const fromBoxCenter = this.getPositionFromCenter(e);
      const newAngle = 90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      
      
      const newRotateAngle = this.currentAngle + (newAngle - (this.startAngle ? this.startAngle : 0))
      console.log(newRotateAngle)
      
      this.props.rotateLayer(this.props.id, newRotateAngle)
      this.angle = newRotateAngle
    }
  }
  
  componentDidMount() {

    const boxPosition = this.layerRef.getBoundingClientRect();
    // get the current center point
    this.boxCenterPoint.x = boxPosition.left + boxPosition.width / 2;
    this.boxCenterPoint.y = boxPosition.top + boxPosition.height / 2;

    window.onmouseup = this.mouseUpHandler;
    window.onmousemove = this.mouseMoveHandler;

    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }

  render() {
    // console.log(this.props)
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
    let styles = {
      width: size.width + 'px',
      height: isDragging ? 0 : size.height + 'px',
      top: coords.y + 'px',
      left: coords.x + 'px',
      opacity: isDragging ? 0 : 1,
      zIndex: zIndex,
      position: 'absolute',
      transform: `rotate(${rotateAngle}deg)`,
    }
    let className = 'single-layer__container image-layer'
    className += isFocused ? ' focused-layer' : ''
    
    let layer = (<div
      className={className}
      style={styles}
      onClick={this.setLayerFocus}
      ref={div => this.layerRef = div}
    >
      <LayerImage content={content} size={size} />
      <div className='transform-layer rotate-layer'
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}/>
      <div className='transform-layer resize-layer' />
    </div>)

    return connectDragSource(layer)
  }
}

const mapStateToProps = state => ({ images: state })

DraggableImage = DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  DraggableImage
)

DraggableImage = connect(
  mapStateToProps,
  { setFocus, rotateLayer }
)(DraggableImage)

export default DraggableImage
