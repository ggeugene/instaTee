// import React from 'react'

// const LayerImage = ({ content, dimensions, sizeToFit }) => {
//   sizeToFit.width = sizeToFit.width + 'px'
//   sizeToFit.height = sizeToFit.height + 'px'
//   return
// }

// export default LayerImage

import React, { Component } from 'react'

export class LayerImage extends Component {
  render() {
    // console.log(this.props)
    this.props.sizeToFit.width = this.props.sizeToFit.width + 'px'
    this.props.sizeToFit.height = this.props.sizeToFit.height + 'px'
    return <img src={this.props.content} alt='' style={this.props.sizeToFit} />
  }
}

export default LayerImage
