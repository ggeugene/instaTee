import React, { Component } from 'react'
import './App.css'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
// import ImageSettings from './components/ImageSettings'
import AddText from './components/AddText'
// import TextSettings from './components/TextSettings'
import LayersList from './components/LayersList'

class App extends Component {
  render() {
    return (
      <div className='App fullscreen'>
        <div className='constructor-container'>
          <div className='col-4' style={{ backgroundColor: 'red' }}>
            <h2>Tools area</h2>
          </div>
          <div className='col-4'>
            {/* <div className='editor__container'> */}
            <Workspace />
            {/* </div> */}
            <UploadImage />
            <AddText />
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
