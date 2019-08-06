import React, { Component } from 'react'
import './App.css'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import RangeSlider from './components/RangeSlider'

class App extends Component {
  doPolygonsIntersect(a, b) {
    let polygons = [a, b]
    let minA, maxA, projected, i, i1, j, minB, maxB

    for (i = 0; i < polygons.length; i++) {
      // for each polygon, look at each edge of the polygon, and determine if it separates
      // the two shapes
      let polygon = polygons[i]
      for (i1 = 0; i1 < polygon.length; i1++) {
        // grab 2 vertices to create an edge
        let i2 = (i1 + 1) % polygon.length
        let p1 = polygon[i1]
        let p2 = polygon[i2]

        // find the line perpendicular to this edge
        let normal = { x: p2.y - p1.y, y: p1.x - p2.x }

        minA = maxA = undefined
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < a.length; j++) {
          projected = normal.x * a[j].x + normal.y * a[j].y
          if (minA === undefined || projected < minA) {
            minA = projected
          }
          if (maxA === undefined || projected > maxA) {
            maxA = projected
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined
        for (j = 0; j < b.length; j++) {
          projected = normal.x * b[j].x + normal.y * b[j].y
          if (minB === undefined || projected < minB) {
            minB = projected
          }
          if (maxB === undefined || projected > maxB) {
            maxB = projected
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // polygons, and we know there is no overlap
        if (maxA < minB || maxB < minA) {
          // console.log("polygons don't intersect!")
          return false
        }
      }
    }
    // console.log('intersect!')
    return true
  }

  render() {
    return (
      <div className='App fullscreen'>
        <div className='constructor-container'>
          <div className='col-4' style={{ backgroundColor: 'red' }}>
            <h2>Tools area</h2>
          </div>
          <div className='col-4'>
            {/* <div className='editor__container'> */}
            <DndProvider backend={HTML5Backend}>
              <Workspace doIntersect={this.doPolygonsIntersect} />
            </DndProvider>
            {/* </div> */}
            <UploadImage />
          </div>
          <div className='col-4'>
            <RangeSlider classes={'brightness'} label={'Brightness'} />
            <RangeSlider classes={'contrast'} label={'Contrast'} />
            <RangeSlider classes={'hue'} label={'Hue'} />
          </div>
        </div>
        <div className='upload-container' />
      </div>
    )
  }
}

export default App
