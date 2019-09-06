import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage } from '../actions'
import iconUpload from '../img/icons/icon-upload.png'

class UploadImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }
  }

  onImageChange = event => {
    const { activeView } = this.props
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]

      this.props.uploadImage(file, activeView)
    }
  }

  render() {
    return (
      <label htmlFor='file-upload' className='tools-button__container file-upload'>
        <input
          id='file-upload'
          type='file'
          onChange={this.onImageChange}
          style={{ display: 'none' }}
        />
        <div className='tools-button__icon'>
          <img src={iconUpload} alt=''></img>
        </div>
        <span id='add-text-layer' className='tools-button__text primary-text-color'>
          Upload
        </span>
      </label>
    )
  }
}

const mapStateToProps = state => ({ state: state, activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  uploadImage: (file, activeView) => dispatch(uploadImage(file, activeView)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
