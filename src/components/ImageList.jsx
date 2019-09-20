import React, { Component } from 'react'
import DraggableImage from './DraggableImage'
import { connect } from 'react-redux'

class ImageList extends Component {
  render() {
    const { area, controls } = this.props
    return this.props.images.map(image => (
      <DraggableImage key={image.id} {...image} area={area} controls={controls} />
    ))
  }
}

const mapStateToProps = state => {
  const activeView = state.views.filter(view => view.isActive)[0]
  return {
    images: state.layers.filter(
      layer =>
        layer.view.viewId === activeView.viewId &&
        layer.view.currentView === activeView.currentView &&
        layer.type === 'image'
    ),
  }
}

export default connect(
  mapStateToProps,
  null
)(ImageList)
