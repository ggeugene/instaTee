import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage, addImage } from '../actions'

class UploadImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false
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
    if (this.state.display && !e.target.closest('.upload-container'))
      this.setState({display: false})
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
        className="upload-container"
        onClick={() => this.setState({ display: true })}
        style={{ position: 'relative' }}
      >
        <div>Upload</div>
        {this.state.display ? (
          <div style={{ position: 'absolute', left: 100, top: 0 }}>
            <ul>
              {uploads.length
                ? uploads.map((imageObject, index) => (
                    <li
                      key={index}
                      onClick={e => {
                        e.stopPropagation()
                        addImage(activeView, imageObject, index)
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        backgroundImage: `url(${imageObject.content})`
                      }}
                    >
                    </li>
                  ))
                : null}
              <li>
                <label htmlFor="file-upload">New</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={this.onImageChange}
                  className="file-upload"
                  style={{ display: 'none' }}
                />
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({ uploads: state.uploads, activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  uploadImage: (file) => dispatch(uploadImage(file)),
  addImage: (activeView, imageObject, uploadedIndex) => dispatch(addImage(activeView, imageObject, uploadedIndex))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImage)
