import React, { useState } from 'react'
import iconArrow from '../img/icons/icon-arrow_black.png'
import { changeColor } from '../actions'
import { connect } from 'react-redux'

function ChangeColor(props) {
  const { changeColor } = props
  const { colors, currentColorId } = props.activeView
  const [state, setState] = useState({ color: colors[currentColorId].hex, display: false })
  return (
    <div
      className={state.display ? 'tools-button__container active' : 'tools-button__container'}
      onClick={() => setState({ ...state, display: !state.display })}>
      <div className='tools-button__icon dropdown'>
        <div className='tool-button__shirt-color' style={{ backgroundColor: state.color }}></div>
        <img src={iconArrow} className='dropdown-icon' alt='' />
      </div>
      <span className='tools-button__text primary-text-color'>Color</span>
      {state.display ? (
        <div className='colors__container'>
          <ul className='colors__list'>
            {colors.map((color, index) => (
              <li
                key={index}
                className='colors__list-item'
                style={{ backgroundColor: color.hex }}
                onClick={() => changeColor(props.activeView.viewId, color.colorId)}></li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const mapStateToProps = state => ({ activeView: state.views.filter(view => view.isActive)[0] })

const mapDispatchToProps = dispatch => ({
  changeColor: (viewId, colorId) => dispatch(changeColor(viewId, colorId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeColor)
