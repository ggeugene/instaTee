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

const mapStateToProps = state => ({
  texts: state.layers.filter(layer => layer.type === 'text'),
})

TextList = connect(
  mapStateToProps,
  null
)(TextList)

export default TextList
