import React from 'react'

const LayerImage = ({ content, dimensions, sizeToFit }) => {
  console.log(sizeToFit)
  // const styles = dimensions
  sizeToFit.width = sizeToFit.width + 'px'
  sizeToFit.height = sizeToFit.height + 'px'
  return <img src={content} style={sizeToFit} alt='' />
}

export default LayerImage
