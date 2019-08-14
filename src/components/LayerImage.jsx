import React, { PureComponent } from 'react'

class LayerImage extends PureComponent {
  render() {
    const { content, opacity, properties } = this.props
    let style = {
      width: '100%',
      height: '100%',
      cursor: 'move',
      opacity: opacity ? opacity : 1,
      filter: `brightness(${properties.brightness}) contrast(${
        properties.contrast
      }%) hue-rotate(${properties.hue}deg)`,
    }
    return (
      <img
        src={content}
        style={style}
        alt=''
        onDragStart={e => e.preventDefault()}
      />
    )
  }
}

export default LayerImage
