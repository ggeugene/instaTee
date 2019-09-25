import React from 'react'
import { connect } from 'react-redux'
import { toggleZoom } from '../actions'
import iconZoom from '../img/icons/icon-zoom.png'

function ToggleZoom({ toggleZoom, activeView }) {
  return (
    <div
      className='tools-button__container'
      onClick={() => toggleZoom(activeView.viewId, !activeView.zoom)}>
      <div className='tools-button__icon'>
        <img src={iconZoom} alt='zoom' />
      </div>
      <span className='tools-button__text primary-text-color'>Zoom</span>
    </div>
  )
}

const mapStateToProps = state => ({
  activeView: state.views.filter(view => view.isActive)[0],
})

const mapDispatchToProps = dispatch => ({
  toggleZoom: (viewId, zoom) => dispatch(toggleZoom(viewId, zoom)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToggleZoom)
