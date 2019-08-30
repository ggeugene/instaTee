import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import TextSettings from './TextSettings'
import ImageSettings from './ImageSettings'
import LayerListItem from './LayerListItem'
import { connect } from 'react-redux'
import { reorderStore } from '../actions'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getTranslateY = string => {
  var mat = string.match(/^translate\((.+)\)$/)
  if (mat) return parseFloat(mat[1].split(', ')[1])
  // mat = string.match(/^matrix\((.+)\)$/)
  // return mat ? parseFloat(mat[1].split(', ')[5]) : 0
}

const getItemStyle = (isDragging, draggableStyle) => {
  return {
    userSelect: 'none',
    padding: '5px 0',
    ...draggableStyle,
    transform: draggableStyle.transform
      ? `translate(0, ${getTranslateY(draggableStyle.transform)}px)`
      : 'none',
  }
}

class LayersList extends Component {
  constructor(props) {
    super(props)

    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const { layers } = this.props

    const reorderedLayers = reorder(
      layers,
      result.source.index,
      result.destination.index
    )

    const { reorderStore } = this.props
    reorderStore(reorderedLayers)
  }

  render() {
    const { layers } = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              className='layers-list'
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {layers.map((layer, index) => (
                <Draggable
                  key={layer.id}
                  draggableId={`draggable-${layer.id}`}
                  index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className='layer-list-item'
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      <LayerListItem
                        dragHandleProps={provided.dragHandleProps}
                        {...layer}
                      />
                      {layer.type === 'image' ? (
                        <ImageSettings layer={layer} />
                      ) : (
                        <TextSettings layer={layer} />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

const mapStateToProps = state => ({ layers: state.layers })

const mapDispatchToProps = dispatch => ({
  reorderStore: layers => dispatch(reorderStore(layers)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersList)
