import React, { Component } from 'react'

class LayerText extends Component {
  render() {
    const { content, properties, opacity, back, stroke } = this.props
    let styles = {
      width: '100%',
      height: '100%',
      cursor: 'move',
      opacity: opacity ? opacity : 1,
      fontSize: properties.fontSize + 'px',
      fontFamily: properties.fontFamily,
      fontStyle: properties.style.italic ? 'italic' : 'normal',
      fontWeight: properties.style.bold ? 'bold' : 'regular',
      textDecoration: properties.style.underline ? 'underline' : 'none',
      color: properties.color,
      textStrokeWidth: stroke ? Math.floor(properties.fontSize / 6) + 'px' : 0,
      textStrokeColor: properties.colorStroke
        ? properties.colorStroke
        : properties.color,
      textAlign: properties.align,
      lineHeight: 1.5,
    }
    if (back) {
      styles = {
        ...styles,
        position: 'absolute',
        left: 0,
        top: 0,
      }
    }
    return <div style={styles}>{content}</div>
  }
}

export default LayerText
