import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import TextSettings from './TextSettings'
import ImageSettings from './ImageSettings'
import LayerListItem from './LayerListItem'
import { connect } from 'react-redux'
import { reorderStore, setFocus } from '../actions'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import LayerActions from './LayerActions'

const reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list).map(item => item.id)
  let zIndexes = Array.from(list).map(item => item.zIndex)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return {
    ids: result,
    zIndexes,
  }
}

const getTranslateY = string => {
  var mat = string.match(/^translate\((.+)\)$/)
  if (mat) return parseFloat(mat[1].split(', ')[1])
}

const getItemStyle = draggableStyle => {
  return {
    userSelect: 'none',
    position: 'static',
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
    this.clickHandler = this.clickHandler.bind(this)
    this.handleBeforeDrag = this.handleBeforeDrag.bind(this)
    this.setSettingsStyle = this.setSettingsStyle.bind(this)
  }

  handleBeforeDrag(id) {
    const layerSettings = document.querySelector(`.layer-list [data-dragid="${id}"] + div`)
    if (layerSettings) {
      layerSettings.style.position = 'absolute'
      layerSettings.style.width = 'calc(100% - 32px * 2)'
      layerSettings.style.opacity = 0.1
    }
  }

  setSettingsStyle(draggableIndex, id = false) {
    if (!id) {
      const domLayers = document.querySelectorAll('.layer-list-item > div')
      const layer = Array.from(domLayers).find((elem, index) => index === draggableIndex)
      if (layer) {
        const layerSettings = document.querySelector(
          `.layer-list [data-dragid="${layer.dataset.dragid}"] + div`
        )
        if (layerSettings) {
          layerSettings.style.position = 'relative'
          layerSettings.style.width = 'auto'
          layerSettings.style.opacity = 1
        }
      }
    } else {
      const layerSettings = document.querySelector(
        `.layer-list [data-dragid="${draggableIndex}"] + div`
      )
      if (layerSettings) {
        layerSettings.style.position = 'relative'
        layerSettings.style.width = 'auto'
        layerSettings.style.opacity = 1
      }
    }
  }

  onDragEnd(result) {
    this.setSettingsStyle(result.source.index)

    if (!result.destination) {
      return
    }
    const { layers } = this.props
    const reordered = reorder(layers, result.source.index, result.destination.index)
    const { reorderStore } = this.props
    reorderStore(reordered.ids, reordered.zIndexes)
  }

  clickHandler(e, id) {
    e.persist()
    let dragDiv = e.target.closest('.drag-item__container')
    const visibilityToggle = e.target.closest('.visibility-toggle')
    if (dragDiv || visibilityToggle) return

    const { setFocus, layers } = this.props
    const focused = layers.filter(layer => layer.isFocused)
    if (focused.length < 1 || focused[0].id !== id) {
      setFocus(id)
    }
  }

  componentDidUpdate() {
    const { layers } = this.props
    const focussed = layers.filter(layer => layer.isFocused)[0]
    if (focussed) {
      const topPosition = document.querySelector(`.layer-list-item[data-itemid="${focussed.id}"`)
        .offsetTop
      document.querySelector('.layer-list').scrollTop = topPosition
    }
  }

  render() {
    const { layers } = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div style={{ position: 'relative', zIndex: 202 }}>
              <LayerActions layer={layers.filter(layer => layer.isFocused)[0]} />
              <div className='layer-list' {...provided.droppableProps} ref={provided.innerRef}>
                {layers.map((layer, index) => (
                  <Draggable key={layer.id} draggableId={`draggable-${layer.id}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className='layer-list-item'
                        style={getItemStyle(provided.draggableProps.style)}
                        onClick={e => this.clickHandler(e, layer.id)}
                        data-itemid={layer.id}>
                        <LayerListItem
                          setSettingsStyle={this.setSettingsStyle}
                          dragHandleProps={{
                            ...provided.dragHandleProps,
                            onMouseDown: (...args) => {
                              this.handleBeforeDrag(layer.id)
                              provided.dragHandleProps.onMouseDown(...args)
                            },
                          }}
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

const mapStateToProps = state => ({
  layers: state.layers.filter(layer => layer.view === state.activeView),
  activeView: state.activeView,
})

const mapDispatchToProps = dispatch => ({
  reorderStore: (ids, zIndexes) => dispatch(reorderStore(ids, zIndexes)),
  setFocus: id => dispatch(setFocus(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersList)
