import React, { Component } from 'react'
import ImageList from './ImageList'
import { connect } from 'react-redux'
import Img from 'react-image'
import TextList from './TextList'
import Preloader from './Preloader'
import { resizeImageOnUpload, scaleLayers, removeFocus, setFocus } from '../actions'
const screenfull = require('screenfull')

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scale: 1,
    }

    this.initialHeight = 1

    this.workspaceRef = React.createRef()
    this.editorRef = React.createRef()

    this.setScaleStyle = this.setScaleStyle.bind(this)
    this.setBackgroundHeight = this.setBackgroundHeight.bind(this)
  }

  setScaleStyle(zoom) {
    let scaleFactor = 1

    if (zoom) {
      scaleFactor = Math.min(
        this.editorRef.current.offsetHeight / this.workspaceRef.current.offsetHeight,
        this.editorRef.current.offsetWidth / this.workspaceRef.current.offsetWidth
      )
      let editorRect = document
        .querySelector('.constructor-container .col-7')
        .getBoundingClientRect()
      let workspacerRect = this.workspaceRef.current.getBoundingClientRect()

      this.editorRef.current.style.transform = `scale(${scaleFactor.toFixed(4)})`

      editorRect = document.querySelector('.constructor-container .col-7').getBoundingClientRect()
      workspacerRect = this.workspaceRef.current.getBoundingClientRect()

      // prevent workspace to go out of the frame of editor
      if (workspacerRect.bottom > editorRect.bottom) {
        this.editorRef.current.style.top = -(workspacerRect.bottom - editorRect.bottom) + 'px'
      } else if (workspacerRect.top < editorRect.top) {
        this.editorRef.current.style.top = editorRect.top - workspacerRect.top + 'px'
      }
      if (workspacerRect.left < editorRect.left) {
        this.editorRef.current.style.left = editorRect.left - workspacerRect.left + 'px'
      } else if (workspacerRect.right > editorRect.right) {
        this.editorRef.current.style.left =
          editorRect.left + editorRect.width - (workspacerRect.left + workspacerRect.width) + 'px'
      }
    } else {
      this.editorRef.current.style = null
    }
  }

  setBackgroundHeight(src) {
    const area = document.querySelector('.constructor-container .col-7')
    return new Promise(resolve => {
      let img = document.createElement('img')

      img.onload = () => {
        const newImageSize = resizeImageOnUpload(img, area, true)
        document.querySelector('#editor .sub-container').style.height = newImageSize.height + 'px'
        resolve(newImageSize.height)
      }
      img.src = src
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeView.zoom !== this.props.activeView.zoom) {
      this.setScaleStyle(this.props.activeView.zoom)
    }
    if (prevProps.activeView.viewId !== this.props.activeView.viewId) {
      const { colors, currentColorId, currentView } = this.props.activeView
      const src = colors[currentColorId][currentView]
      this.setBackgroundHeight(src).then(h => (this.initialHeight = h))
    }
  }
  componentDidMount() {
    let scale = 1
    let focusedId
    const { colors, currentColorId, currentView } = this.props.activeView
    const { scaleLayers, removeFocus, setFocus } = this.props
    const src = colors[currentColorId][currentView]
    this.setBackgroundHeight(src).then(h => (this.initialHeight = h))

    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        const { currentView, viewId } = this.props.activeView
        if (screenfull.isFullscreen) {
          scale = document.querySelector('.workspace__background').offsetHeight / this.initialHeight
          this.editorRef.current.style.pointerEvents = 'none'
          this.setState({ scale: scale }, () => {
            if (this.props.hasFocus) {
              focusedId = this.props.hasFocus.id
              removeFocus()
            }
            scaleLayers(viewId, currentView, scale)
          })
        } else {
          if (focusedId === 0 || focusedId) {
            setFocus(focusedId)
          }
          scaleLayers(viewId, currentView, scale, true)
          this.editorRef.current.style.pointerEvents = 'auto'
        }
      })
    }
  }

  render() {
    const { hasFocus } = this.props
    const { colors, currentColorId, currentView, styles } = this.props.activeView
    const src = colors[currentColorId][currentView]

    let className = 'workspace__area '
    className = hasFocus ? className + 'has-focus ' : className
    className = colors[currentColorId].isLight
      ? className + 'dark-border'
      : className + 'light-border'

    return (
      <div id='editor' className='editor__container' ref={this.editorRef}>
        <div className='sub-container'>
          <Img src={src} alt='' className='workspace__background' loader={<Preloader />} />
          <div className={className + ' back-area'} style={styles}>
            <div className='layers__container'>
              <div className='area no-overflow'>
                <ImageList area={this.workspaceRef.current} controls={false} />
                <TextList area={this.workspaceRef.current} controls={false} />
              </div>
            </div>
          </div>
          <div className={className + ' front-area'} style={styles} ref={this.workspaceRef}>
            <div className='layers__container'>
              <ImageList area={this.workspaceRef.current} controls={true} />
              <TextList area={this.workspaceRef.current} controls={true} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const activeView = state.views.filter(view => view.isActive)[0]
  return {
    hasFocus: state.layers.filter(
      layer =>
        layer.isFocused &&
        layer.view.viewId === activeView.viewId &&
        layer.view.currentView === activeView.currentView
    )[0],
    activeView,
  }
}

const mapDispatchToProps = dispatch => ({
  scaleLayers: (viewId, currentView, scale, unscale) =>
    dispatch(scaleLayers(viewId, currentView, scale, unscale)),
  removeFocus: () => dispatch(removeFocus()),
  setFocus: id => dispatch(setFocus(id)),
})

Workspace = connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)

export default Workspace
