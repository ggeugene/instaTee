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
    // isOver: monitor.isOver(),
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
    if (e.target.classList.contains('layers__container')) {
      this.props.removeFocus()
    }
  }

  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div>
        <div className='workspace__area back-area'>
          <div className='layers__container'>
            <div className='area no-overflow'>
              <CustomDragLayer area={this.workspaceRef} />
              <ImageList area={this.workspaceRef} controls={false} />
            </div>
          </div>
        </div>
        <div
          className='workspace__area front-area'
          onMouseDown={e => this.resetFocus(e)}
          ref={div => (this.workspaceRef = div)}>
          <div className='layers__container'>
            <CustomDragLayer back={true} />
            <ImageList area={this.workspaceRef} controls={true} />
          </div>
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
