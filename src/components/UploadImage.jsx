import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage, addImage, deleteUploaded } from '../actions'
import iconUpload from '../img/icons/icon-upload.png'
import iconUploadGreen from '../img/icons/icon-upload_green.png'
import iconPlus from '../img/icons/icon-plus-2x.png'
import iconClose from '../img/icons/icon-close.png'

class UploadImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false,
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.displayList = this.displayList.bind(this)
  }

  onImageChange = event => {
    const { uploadImage } = this.props
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]

      uploadImage(file)
    }
  }

  displayList(e) {
    if (this.state.display && !e.target.closest('.uploads-list')) {
      this.setState({ display: false })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.displayList)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.displayList)
  }

  render() {
    const { activeView, uploads, addImage, deleteUploaded } = this.props
    return (
      <div
        className={
          this.state.display ? 'tools-button__container active' : 'tools-button__container'
        }
        onClick={e => {
          e.stopPropagation()
          if (!e.target.closest('.uploads-list')) this.setState({ display: !this.state.display })
        }}>
        <div className='tools-button__icon'>
          <div
            style={{ backgroundImage: `url(${iconUploadGreen})` }}
            className='tools-button__icon-container'>
            <img src={iconUpload} alt='text' className='icon-black' />
          </div>
        </div>
        <span className='tools-button__text primary-text-color'>Upload</span>
        {this.state.display ? (
          <div className='uploads-list'>
            <span className='uploads-title primary-text-color'>Your uploads</span>
            <ul>
              {uploads.length
                ? uploads.map((imageObject, index) => (
                    <li
                      key={index}
                      onClick={e => {
                        e.stopPropagation()
                        addImage(activeView, imageObject, index)
                      }}
                      className='uploads__single-item'>
                      <div
                        className='uploads__single-item-image'
                        style={{
                          backgroundImage: `url(${imageObject.content})`,
                        }}></div>
                      <span className='uploads__single-item-text'>
                        {imageObject.fileName.length > 21
                          ? imageObject.fileName.slice(0, 18) + '...'
                          : imageObject.fileName}
                      </span>
                      <img
                        className='uploads__icon-close'
                        src={iconClose}
                        alt=''
                        onClick={e => {
                          e.stopPropagation()
                          deleteUploaded(index)
                        }}
                      />
                    </li>
                  ))
                : null}
              <li className='uploads__single-item upload-item'>
                <label htmlFor='file-upload'>
                  <img src={iconPlus} alt='Upload' />
                </label>
                <input
                  id='file-upload'
                  type='file'
                  onChange={this.onImageChange}
                  className='file-upload'
                  style={{ display: 'none' }}
                />
              </li>
            </ul>
            <span className='uploads-notice'>
              If you post inappropriate content, it may be removed by Dribbble per our Terms of
              Service. Dribbble has final say over whether
            </span>
            <span className='uploads-subnotice'>
              Drag and drop to upload to choose a file
              <br />
              <span>Up to 10 Mb</span>
            </span>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({ uploads: state.uploads, activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  uploadImage: file => dispatch(uploadImage(file)),
  addImage: (activeView, imageObject, uploadedIndex) =>
    dispatch(addImage(activeView, imageObject, uploadedIndex)),
  deleteUploaded: index => dispatch(deleteUploaded(index)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
