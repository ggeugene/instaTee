import React, { PureComponent } from 'react'

class LayerImage extends PureComponent {
  render() {
    const { content, opacity } = this.props
    return (
      <img
        src={content}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'move',
          opacity: opacity ? opacity : 1,
        }}
        alt=''
      />
    )
  }
}

export default LayerImage
