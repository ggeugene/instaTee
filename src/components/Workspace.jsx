import React, { Component } from 'react'
import ImageList from './ImageList'
import { connect } from 'react-redux'
import Img from 'react-image'
import TextList from './TextList'
import Preloader from './Preloader'

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.workspaceRef = React.createRef()
    this.editorRef = React.createRef()

    this.setScaleStyle = this.setScaleStyle.bind(this)
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

  componentDidUpdate(prevProps) {
    if (prevProps.activeView.zoom !== this.props.activeView.zoom) {
      this.setScaleStyle(this.props.activeView.zoom)
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
    )
  }
}

const mapStateToProps = state => {
  const activeView = state.views.filter(view => view.isActive)[0]
  return {
    hasFocus: state.layers.filter(
      layer => layer.isFocused && layer.view.viewId === activeView.viewId
    )[0],
    activeView,
  }
}

Workspace = connect(
  mapStateToProps,
  null
)(Workspace)

export default Workspace
