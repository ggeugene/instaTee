import React, { Component } from 'react'
import ImageList from './ImageList'
import { removeFocus } from '../actions'
import { connect } from 'react-redux'
import TextList from './TextList'
import frontView from '../img/black-front.png'
import backView from '../img/black-back.png'

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.resetFocus = this.resetFocus.bind(this)
    this.workspaceRef = React.createRef()
  }

  resetFocus(e) {
    if (e.target.classList.contains('layers__container')) {
      this.props.removeFocus()
    }
  }

  render() {
    console.log(this.props)
    let { activeView } = this.props.state
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
        <div className='workspace__area back-area'>
          <div className='layers__container'>
            <div className='area no-overflow'>
              <ImageList area={this.workspaceRef.current} controls={false} />
              <TextList area={this.workspaceRef.current} controls={false} />
            </div>
          </div>
        </div>
        <div
          className='workspace__area front-area'
          onMouseDown={e => this.resetFocus(e)}
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

const mapDispatchToProps = dispatch => ({
  removeFocus: () => dispatch(removeFocus()),
})

Workspace = connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)

export default Workspace
