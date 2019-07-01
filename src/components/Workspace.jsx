import React, { Component } from 'react'
import ImageList from './ImageList'
import { moveLayer } from '../actions'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants'

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

    this.areaRef = React.createRef()

    this.state = {
      area: this.areaRef,
    }
  }

  componentDidMount() {
    this.setState({ area: this.areaRef })
  }

  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div className='workspace__area' ref={this.areaRef}>
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
