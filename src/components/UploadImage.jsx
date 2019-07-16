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
    // let images = this.props.currentState.layers
    return (
      <div>
        <input id='file-upload' type='file' onChange={this.onImageChange} />
        {/* <ul>
          {images.map(image => (
            <li key={image.id}>
              width: {image.size.width} height: {image.size.height}
            </li>
          ))}
        </ul> */}
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
