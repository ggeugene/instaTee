import React, { Component } from 'react'
import { connect } from 'react-redux'
import DraggableText from './DraggableText'

class TextList extends Component {
  render() {
    const { area, controls } = this.props
    return this.props.texts.map(text => (
      <DraggableText key={text.id} {...text} area={area} controls={controls} />
    ))
  }
}

const mapStateToProps = state => {
  const activeView = state.views.filter(view => view.isActive)[0]
  return {
    texts: state.layers.filter(
      layer =>
        layer.view.viewId === activeView.viewId &&
        layer.view.currentView === activeView.currentView &&
        layer.type === 'text'
    ),
  }
}

TextList = connect(
  mapStateToProps,
  null
)(TextList)

export default TextList
