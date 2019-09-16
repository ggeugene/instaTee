import React from 'react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import iconDownload from '../img/icons/icon-download.png'
import { removeFocus, setFocus } from '../actions'
import { connect } from 'react-redux'

function Download(props) {
  const { removeFocus, setFocus, layer } = props

  const saveScreenshot = (id = undefined) => {
    const editor = document.getElementById('editor')
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    window.scrollTo(0, 0)
    if (id !== undefined) {
      removeFocus(id).then(() => {
        html2canvas(editor)
          .then(canvas => {
            canvas.toBlob(function(blob) {
              saveAs(blob, 'screenshot.png')
            })
          })
          .then(() => {
            window.scrollTo(scrollX, scrollY)
            if (id !== undefined) setFocus(id)
          })
      })
    } else {
      html2canvas(editor)
        .then(canvas => {
          canvas.toBlob(function(blob) {
            saveAs(blob, 'screenshot.png')
          })
        })
        .then(() => {
          window.scrollTo(scrollX, scrollY)
        })
    }
  }
  return (
    <div
      className='tools-button__container'
      onClick={() => {
        saveScreenshot(layer ? layer.id : undefined)
      }}>
      <div className='tools-button__icon'>
        <img src={iconDownload} alt='download' />
      </div>
      <span className='tools-button__text primary-text-color'>Download</span>
    </div>
  )
}

const mapStateToProps = state => ({ layer: state.layers.filter(layer => layer.isFocused)[0] })

const mapDispatchToProps = dispatch => ({
  removeFocus: () => dispatch(removeFocus()),
  setFocus: id => dispatch(setFocus(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Download)
