import React, { PureComponent } from 'react'

class LayerImage extends PureComponent {
  render() {
    // const { content, opacity, back, setImageRef, properties } = this.props
    const { content, opacity, back, properties } = this.props
    let style = {
      width: '100%',
      height: '100%',
      cursor: 'move',
      opacity: opacity ? opacity : 1,
      filter: `brightness(${properties.brightness}) contrast(${
        properties.contrast
      }%) hue-rotate(${properties.hue}deg)`,
    }
    if (back) {
      style = {
        ...style,
        position: 'absolute',
        left: 0,
        top: 0,
      }
    }
    // return setImageRef ? (
    //   <img
    //     src={content}
    //     style={style}
    //     alt=''
    //     ref={img => setImageRef(img)}
    //     onDragStart={e => e.preventDefault()}
    //   />
    // ) : (
    //   <img src={content} style={style} alt='' />
    // )
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
