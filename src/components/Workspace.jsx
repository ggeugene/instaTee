import React, { Component } from 'react'
import ImageList from './ImageList'
import { removeFocus } from '../actions'
import { connect } from 'react-redux'
import TextList from './TextList'

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.resetFocus = this.resetFocus.bind(this)
    this.workspaceRef = null
  }

  resetFocus(e) {
    if (e.target.classList.contains('layers__container')) {
      this.props.removeFocus()
    }
  }

  render() {
    return (
      <div className='editor__container'>
        <div className='workspace__area back-area'>
          <div className='layers__container'>
            <div className='area no-overflow'>
              <ImageList area={this.workspaceRef} controls={false} />
              <TextList area={this.workspaceRef} controls={false} />
            </div>
          </div>
        </div>
        <div
          className='workspace__area front-area'
          onMouseDown={e => this.resetFocus(e)}
          ref={div => (this.workspaceRef = div)}>
          <div className='layers__container'>
            <ImageList area={this.workspaceRef} controls={true} />
            <TextList area={this.workspaceRef} controls={true} />
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
