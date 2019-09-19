import React from 'react'
import { changeViewType } from '../actions'
import iconShirt from '../img/icons/icon-shirt.png'
import iconArrow from '../img/icons/icon-arrow_black.png'
import iconAccessories from '../img/icons/icon-accessories.svg'
import { connect } from 'react-redux'

function ChangeViewType(props) {
  const { views } = props
  const activeView = views.filter(view => view.isActive)[0]
  return (
    <div className='tools-button__container'>
      <div className='tools-button__icon dropdown'>
        <img src={activeView.categoryId !== 3 ? iconShirt : iconAccessories} alt='change shirt' />
        <img src={iconArrow} className='dropdown-icon' alt='' />
      </div>
      <span className='tools-button__text primary-text-color'>Shirt</span>
      <div className=''></div>
    </div>
  )
}

const mapStateToProps = state => ({ views: state.views })

const mapDispatchToProps = dispatch => ({
  changeViewType: viewId => dispatch(changeViewType(viewId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeViewType)
