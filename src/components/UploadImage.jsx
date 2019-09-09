import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage, addImage } from '../actions'
import iconUpload from '../img/icons/icon-upload.png'
import iconPlus from '../img/icons/icon-plus-2x.png'

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
    if (this.state.display && !e.target.closest('uploads-list')) {
      console.log(e.target)
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
    const { activeView, uploads, addImage } = this.props
    return (
      <div
        className={
          this.state.display ? 'tools-button__container active' : 'tools-button__container'
        }
        onClick={e => {
          e.stopPropagation()
          if (!e.target.closest('.uploads-list')) this.setState({ display: !this.state.display })
        }}
        style={{ position: 'relative' }}>
        <div className='tools-button__icon'>
          <img src={iconUpload} alt='upload' />
        </div>
        <span className='tools-button__text primary-text-color'>Upload</span>
        {this.state.display ? (
          <div
            style={{ position: 'absolute', left: 125, top: 0, zIndex: 99999 }}
            className='uploads-list'>
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
