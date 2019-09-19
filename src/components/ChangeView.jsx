import React, { useState } from 'react'
import { changeView } from '../actions'
import { connect } from 'react-redux'
import iconChangeView from '../img/icons/icon-change_view.png'

function ChangeView(props) {
  const [changed, setChanged] = useState(false)
  const { changeView } = props
  const { viewId, currentView } = props.activeView
  let newView = ''

  switch (currentView) {
    case 'front':
      newView = 'back'
      break
    case 'back':
      newView = 'front'
      break
    default:
      break
  }
  return (
    <div
      className='tools-button__container'
      onClick={() => {
        changeView(newView, viewId)
        setChanged(true)
        setTimeout(() => setChanged(false), 3000)
      }}
      id='change-view__button'>
      <div className='tools-button__icon'>
        <img src={iconChangeView} alt='change view' />
      </div>
      <span className='tools-button__text primary-text-color'>View</span>
      {changed ? (
        <div className='view-popup'>
          <span>{currentView.toUpperCase()}</span>
        </div>
      ) : null}
    </div>
  )
}

const mapStateToProps = state => ({
  activeView: state.views.filter(view => view.isActive)[0],
})

const mapDispatchToProps = dispatch => ({
  changeView: (activeView, viewId) => dispatch(changeView(activeView, viewId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeView)
