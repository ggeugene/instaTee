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
    return (
      <div>
        <input id='file-upload' type='file' onChange={this.onImageChange} />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  uploadImage: file => dispatch(uploadImage(file)),
})

export default connect(
  null,
  mapDispatchToProps
)(UploadImage)
