import React from 'react'
import { changeView } from '../actions'
import { connect } from 'react-redux'

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
    <div className='change-view__container'>
      <button onClick={() => changeView(view)} id='change-view__button'>
        Change View
      </button>
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
