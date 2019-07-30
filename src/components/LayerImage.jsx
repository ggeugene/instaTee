import React, { PureComponent } from 'react'

class LayerImage extends PureComponent {
  render() {
    const { content, opacity, back, setImageRef } = this.props
    let style = {
      width: '100%',
      height: '100%',
      cursor: 'move',
      opacity: opacity ? opacity : 1,
    }
    if (back) {
      style = {
        ...style,
        position: 'absolute',
        left: 0,
        top: 0,
      }
    }
    return setImageRef ? (
      <img src={content} style={style} alt='' ref={img => setImageRef(img)} />
    ) : (
      <img src={content} style={style} alt='' />
    )
  }
}

export default LayerImage
