import React, { Component } from 'react'
import ImageList from './ImageList'
import { moveLayer, removeFocus } from '../actions'
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
  constructor(props) {
    super(props)

    this.resetFocus = this.resetFocus.bind(this)
    this.workspaceRef = null
  }

  resetFocus(e) {
    if (e.target.classList.contains('workspace__area')) {
      this.props.removeFocus()
    }
  }

  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div
        className='workspace__area'
        onMouseDown={e => this.resetFocus(e)}
        ref={div => (this.workspaceRef = div)}>
        <CustomDragLayer />
        <div className='layers__container'>
          <ImageList area={this.workspaceRef} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ images: state })

const mapDispatchToProps = dispatch => ({
  moveLayer: (id, coords) => dispatch(moveLayer(id, coords)),
  removeFocus: () => dispatch(removeFocus()),
})

Workspace = DropTarget(ItemTypes.EDITOR_LAYER_ITEM, DropSpecs, collect)(
  Workspace
)
Workspace = connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)

export default Workspace
