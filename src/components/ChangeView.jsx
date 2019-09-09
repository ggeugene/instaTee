import React from 'react'
import { changeView } from '../actions'
import { connect } from 'react-redux'
import iconChangeView from '../img/icons/icon-change_view.png'

function ChangeView(props) {
  const { activeView, changeView } = props
  let view = ''
  switch (activeView) {
    case 'front':
      view = 'back'
      break
    case 'back':
      view = 'front'
      break
    default:
      break
  }
  return (
    <div
      className='tools-button__container'
      onClick={() => changeView(view)}
      id='change-view__button'>
      <div className='tools-button__icon'>
        <img src={iconChangeView} alt='change view' />
      </div>
      <span className='tools-button__text primary-text-color'>View</span>
    </div>
  )
}

const mapStateToProps = state => ({ activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  changeView: activeView => dispatch(changeView(activeView)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeView)
