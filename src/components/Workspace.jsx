import React, { Component } from 'react'
import ImageList from './ImageList'
import { connect } from 'react-redux'
import TextList from './TextList'
import frontView from '../img/black-front.png'
import backView from '../img/black-back.png'

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.workspaceRef = React.createRef()
  }

  render() {
    let { activeView } = this.props.state
    let hasFocus = this.props.state.layers.filter(layer => layer.isFocused)[0]
    let background = ''
    switch (activeView) {
      case 'front':
        background = frontView
        break
      case 'back':
        background = backView
        break
      default:
        background = frontView
        break
    }
    return (
      <div
        className='editor__container'
        style={{
          backgroundImage: `url(${background})`,
        }}>
        <div className={hasFocus ? 'workspace__area has-focus back-area' : 'workspace__area back-area'}>
          <div className='layers__container'>
            <div className='area no-overflow'>
              <ImageList area={this.workspaceRef.current} controls={false} />
              <TextList area={this.workspaceRef.current} controls={false} />
            </div>
          </div>
        </div>
        <div
          className={hasFocus ? 'workspace__area has-focus front-area' : 'workspace__area front-area'}
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

const mapStateToProps = state => ({ state: state })

Workspace = connect(
  mapStateToProps,
  null
)(Workspace)

export default Workspace
