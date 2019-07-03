import React, { Component } from 'react'
import './App.css'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class App extends Component {
  render() {
    return (
      <div className='App fullscreen'>
        <div className='constructor-container'>
          <div className='col-4' style={{ backgroundColor: 'red' }}>
            <h2>Tools area</h2>
          </div>
          <div className='col-4'>
            <div className='editor__container'>
              <DndProvider backend={HTML5Backend}>
                <Workspace />
              </DndProvider>
            </div>
            <UploadImage />
          </div>
          <div className='col-4' style={{ backgroundColor: 'blue' }}>
            <h2>Layers area</h2>
          </div>
        </div>
        <div className='upload-container' />
      </div>
    )
  }
}

// export default App

// function App() {
//   return (
//     <div className='App fullscreen'>
//       <div className='constructor-container'>
//         <div className='col-4' style={{ backgroundColor: 'red' }}>
//           <h2>Tools area</h2>
//         </div>
//         <div className='col-4'>
//           <div className='editor__container'>
//             <Workspace />
//           </div>
//           <UploadImage />
//         </div>
//         <div className='col-4' style={{ backgroundColor: 'blue' }}>
//           <h2>Layers area</h2>
//         </div>
//       </div>
//       <div className='upload-container' />
//     </div>
//   )
// }

// App = DragDropContext(HTML5Backend)(App)
export default App
