import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage } from '../actions'

class UploadImage extends Component {
  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]

      this.props.uploadImage(file)
    }
  }

  render() {
    // let activeView = this.props.currentState.workspace.activeView
    let images = this.props.currentState.layers
    return (
      <div>
        <input type='file' onChange={this.onImageChange} />
        {/* <div className='images'>
          {images.map(image => (
            <img key={image.id} src={image.content} />
          ))}
        </div> */}
        <ul>
          {images.map(image => (
            <li key={image.id}>
              width: {image.dimensions.width} height: {image.dimensions.height}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentState: state,
  }
}

const mapDispatchToProps = dispatch => ({
  uploadImage: file => dispatch(uploadImage(file)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
