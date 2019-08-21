import React, { Component } from 'react'

class LayerText extends Component {
  render() {
    const { content, properties, opacity, stroke } = this.props
    let styles = {
      width: '100%',
      height: '100%',
      cursor: 'move',
      opacity: opacity ? opacity : 1,
      fontFamily: properties.fontFamily,
      fontStyle: properties.style.italic ? 'italic' : 'normal',
      fontWeight: properties.style.bold ? 'bold' : 'normal',
      textDecoration: properties.style.underline ? 'underline' : 'none',
      WebkitTextStrokeWidth:
        Math.floor(properties.fontSize / 50) < 1
          ? 1 + 'px'
          : Math.floor(properties.fontSize / 50) + 'px',
      WebkitTextStrokeColor: properties.colorStroke
        ? properties.colorStroke
        : 'transparent',
      color: properties.color,
      textAlign: properties.align,
      lineHeight: 'normal',
      whiteSpace: 'pre',
    }
    return <div style={styles}>{content}</div>
  }
}

export default LayerText
