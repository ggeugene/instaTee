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
  }

  render() {
    const { hasFocus } = this.props
    const { colors, currentColorId, currentView, styles, zoom } = this.props.activeView
    const src = colors[currentColorId][currentView]

    let className = 'workspace__area '
    className = hasFocus ? className + 'has-focus ' : className
    className = colors[currentColorId].isLight
      ? className + 'dark-border'
      : className + 'light-border'

    return (
      <div
        id='editor'
        className='editor__container'
        style={{ transform: zoom ? 'scale(1.35)' : null }}>
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
