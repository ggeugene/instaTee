import React, { Component } from 'react'
import './App.css'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
import AddText from './components/AddText'
import LayersList from './components/LayersList'
import ChangeView from './components/ChangeView'
import { removeFocus } from './actions'
import { connect } from 'react-redux'

class App extends Component {
  constructor(props) {
    super(props)

    this.resetFocus = this.resetFocus.bind(this)
  }

  resetFocus(e) {
    if (
      !e.target.closest('.layers-list') &&
      !e.target.classList.contains('file-upload')
    ) {
      this.props.removeFocus()
    }
  }

  componentDidMount() {
    window.addEventListener('mousedown', e => this.resetFocus(e))
  }

  render() {
    return (
      <div className='App fullscreen'>
        <div className='constructor-container'>
          <div className='col-4'>
            <h2>Tools area</h2>
            <UploadImage />
            <AddText />
            <ChangeView />
          </div>
          <div className='col-4'>
            <Workspace />
          </div>
          <div className='col-4'>
            <LayersList />
          </div>
        </div>
        <div className='upload-container' />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  removeFocus: () => dispatch(removeFocus()),
})

export default connect(
  null,
  mapDispatchToProps
)(App)
