import React, { Component } from 'react'
import './App.css'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
import AddText from './components/AddText'
import LayersList from './components/LayersList'
import ChangeView from './components/ChangeView'

class App extends Component {
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

export default App
