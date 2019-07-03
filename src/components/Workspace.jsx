import React, { Component } from 'react'
import ImageList from './ImageList'
import { moveLayer } from '../actions'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants'
import CustomDragLayer from './CustomDragLayer'

const DropSpecs = {
  drop(props, monitor) {
    const { moveLayer } = props
    const id = monitor.getItem().id
    const delta = monitor.getDifferenceFromInitialOffset()
    const x = Math.round(parseInt(monitor.getItem().coords.x) + delta.x)
    const y = Math.round(parseInt(monitor.getItem().coords.y) + delta.y)
    moveLayer(id, { x, y })
  },
}

function collect(connect, monitor) {
  const info = {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }

  return info
}

class Workspace extends Component {
  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div className='workspace__area'>
        <CustomDragLayer />
        <div className='layers__container'>
          <ImageList />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ images: state })

Workspace = DropTarget(ItemTypes.EDITOR_LAYER_ITEM, DropSpecs, collect)(
  Workspace
)
Workspace = connect(
  mapStateToProps,
  { moveLayer }
)(Workspace)

export default Workspace
