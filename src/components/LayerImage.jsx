import React, { PureComponent } from 'react'

class LayerImage extends PureComponent {
  render() {
    const { content, size } = this.props
    return (
      <img
        src={content}
        style={{
          width: size.width + 'px',
          height: size.height + 'px',
        }}
        alt=''
      />
    )
  }
}

export default LayerImage
