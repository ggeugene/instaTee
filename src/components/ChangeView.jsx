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
    <div>
      <button onClick={() => changeView(view)} id='add-text-layer'>
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
