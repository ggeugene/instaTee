import React, { PureComponent } from 'react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../constants'
import LayerImage from './LayerImage'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { setFocus } from '../actions'
import { connect } from 'react-redux'

const ImageSource = {
  beginDrag(props, dnd, element) {
    props.setFocus(props.id)
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
  componentDidMount() {
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
      id,
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
    console.log(size)
    return connectDragSource(
      <div
        className={className}
        style={styles}
        onClick={this.props.setFocus.bind(this, id)}>
        <LayerImage content={content} size={size} />
        <div className='transform-layer rotate-layer' />
        <div className='transform-layer resize-layer' />
      </div>
    )
  }
}

const mapStateToProps = state => ({ images: state })

DraggableImage = DragSource(ItemTypes.EDITOR_LAYER_ITEM, ImageSource, collect)(
  DraggableImage
)

DraggableImage = connect(
  mapStateToProps,
  { setFocus }
)(DraggableImage)

export default DraggableImage
