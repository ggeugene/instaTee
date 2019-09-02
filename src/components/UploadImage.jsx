import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage } from '../actions'

class UploadImage extends Component {
  onImageChange = event => {
    const { activeView } = this.props
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]

      this.props.uploadImage(file, activeView)
    }
  }

  render() {
    return (
      <div>
        <input
          id='file-upload'
          type='file'
          onChange={this.onImageChange}
          className='file-upload'
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({ activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  uploadImage: (file, activeView) => dispatch(uploadImage(file, activeView)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
