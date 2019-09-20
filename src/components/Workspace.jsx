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
    const { colors, currentColorId, currentView, styles } = this.props.activeView
    const src = colors[currentColorId][currentView]

    return (
      <div id='editor' className='editor__container'>
        <Img src={src} alt='' className='workspace__background' loader={<Preloader />} />
        <div
          className={hasFocus ? 'workspace__area has-focus back-area' : 'workspace__area back-area'}
          style={styles}>
          <div className='layers__container'>
            <div className='area no-overflow'>
              <ImageList area={this.workspaceRef.current} controls={false} />
              <TextList area={this.workspaceRef.current} controls={false} />
            </div>
          </div>
        </div>
        <div
          className={
            hasFocus ? 'workspace__area has-focus front-area' : 'workspace__area front-area'
          }
          style={styles}
          ref={this.workspaceRef}>
          <div className='layers__container'>
            <ImageList area={this.workspaceRef.current} controls={true} />
            <TextList area={this.workspaceRef.current} controls={true} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  hasFocus: state.layers.filter(layer => layer.isFocused)[0],
  activeView: state.views.filter(view => view.isActive)[0],
})

Workspace = connect(
  mapStateToProps,
  null
)(Workspace)

export default Workspace
