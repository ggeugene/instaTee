import React, { Component } from 'react'
import './App.scss'
import UploadImage from './components/UploadImage'
import Workspace from './components/Workspace'
import AddText from './components/AddText'
import LayersList from './components/LayersList'
import ChangeView from './components/ChangeView'
import AddDesign from './components/AddDesign'
import Download from './components/Download'
import ChangeViewType from './components/ChangeViewType'
import ChangeColor from './components/ChangeColor'
import { removeFocus } from './actions'
import { connect } from 'react-redux'
import iconFullscreen from './img/icons/icon-fullscreen.png'
import ToggleZoom from './components/ToggleZoom'
const screenfull = require('screenfull')

class App extends Component {
  constructor(props) {
    super(props)

    this.resetFocus = this.resetFocus.bind(this)
    this.handleDoubleTap = this.handleDoubleTap.bind(this)
    this.scrolled = false
    this.doubleTap = null
  }

  resetFocus(e) {
    let leftClick = false
    if (e.button) {
      leftClick = e.button === 0 ? true : false
    } else {
      e = e.touches && e.touches.length ? e.touches[0] : e
      leftClick = true
    }
    const focused = document.querySelectorAll('.focused-layer')
    if (
      leftClick &&
      focused.length &&
      !e.target.closest('.layer-list') &&
      !e.target.closest('.add-layer__container') &&
      !e.target.closest('.layer-actions') &&
      !e.target.closest('.tools-container') &&
      !e.target.closest('.single-layer__container')
    ) {
      this.props.removeFocus()
    }
  }

  handleDoubleTap(e) {
    if (!this.doubleTap) {
      this.doubleTap = setTimeout(() => {
        this.doubleTap = null
        if (!this.scrolled) this.resetFocus(e)
      }, 300)
    } else {
      clearTimeout(this.doubleTap)
      this.doubleTap = null
    }
  }

  componentDidMount() {
    window.addEventListener('mousedown', e => this.resetFocus(e))
    window.addEventListener('touchstart', e => this.handleDoubleTap(e))
    window.addEventListener('touchmove', e => {
      if (e.touches && e.type === 'touchmove') {
        this.scrolled = true
      }
    })
  }

  render() {
    return (
      <div className='App'>
        <div className='constructor-container'>
          <div className='col-1'>
            <div className='add-layer__container'>
              <AddDesign />
              <UploadImage />
              <AddText />
            </div>
          </div>
          <div className='col-7'>
            <Workspace />
          </div>
          <div className='col-4'>
            <h2 className='layer-list__title'>Layers</h2>
            <LayersList />
          </div>
        </div>
        <div className='tools-container'>
          <div className='col-8 flex-row'>
            <div className='single-tool__container'>
              <ChangeViewType />
              <ChangeColor />
            </div>
            <div className='multi-tool__container'>
              <ChangeView />
              <ToggleZoom />
              <div
                className='tools-button__container'
                onClick={() => {
                  if (screenfull.isEnabled) screenfull.request(document.getElementById('editor'))
                }}>
                <div className='tools-button__icon'>
                  <img src={iconFullscreen} alt='fullscreen' />
                </div>
                <span className='tools-button__text primary-text-color'>Fullscreen</span>
              </div>
              <Download />
            </div>
          </div>
          <div className='col-4'>
            <div className='price-row__container'>
              <div className='price-row flex-row'>
                <span className='price'>$399,99</span>
                <div className='button__container'>
                  <span className='button__text'>Buy</span>
                </div>
              </div>
              <div className='subprice-row'>
                <span className='subprice__text'>
                  We analyze the advantages and disadvanta of your closest competitors and build a
                  solution for your business idea.
                </span>
              </div>
            </div>
          </div>
        </div>
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
