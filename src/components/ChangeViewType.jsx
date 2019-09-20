import React, { useState } from 'react'
import { changeViewType } from '../actions'
import iconShirt from '../img/icons/icon-shirt.png'
import iconArrow from '../img/icons/icon-arrow_black.png'
import iconAccessories from '../img/icons/icon-accessories.svg'
import { connect } from 'react-redux'

function ChangeViewType(props) {
  const { views, changeViewType } = props
  const activeView = views.filter(view => view.isActive)[0]
  const [state, setState] = useState({ display: false, categoryId: activeView.categoryId })

  const categoryClick = e => {
    if (e.target.dataset.catid) {
      const newCatId = parseInt(e.target.dataset.catid)
      setState({ ...state, categoryId: newCatId })
    }
  }
  console.log(state)
  return (
    <div
      className={state.display ? 'tools-button__container active' : 'tools-button__container'}
      onClick={e => {
        e.stopPropagation()
        if (!e.target.closest('.view-types__container')) {
          setState({ ...state, display: !state.display })
        }
      }}>
      <div className='tools-button__icon dropdown'>
        <img src={state.categoryId !== 3 ? iconShirt : iconAccessories} alt='change shirt' />
        <img src={iconArrow} className='dropdown-icon' alt='' />
      </div>
      <span className='tools-button__text primary-text-color'>Shirt</span>
      {state.display ? (
        <div>
          <div className='view-types__wrapper'></div>
          <div className='view-types__container'>
            <ul className='view-types__category-list'>
              <li
                key='0'
                className={
                  state.categoryId === 0
                    ? 'view-types__category-list-item active'
                    : 'view-types__category-list-item'
                }
                data-catid='0'
                onClick={e => categoryClick(e)}>
                Men's
              </li>
              <li
                key='1'
                className={
                  state.categoryId === 1
                    ? 'view-types__category-list-item active'
                    : 'view-types__category-list-item'
                }
                data-catid='1'
                onClick={e => categoryClick(e)}>
                Women's
              </li>
              <li
                key='2'
                className={
                  state.categoryId === 2
                    ? 'view-types__category-list-item active'
                    : 'view-types__category-list-item'
                }
                data-catid='2'
                onClick={e => categoryClick(e)}>
                Children's
              </li>
              <li
                key='3'
                className={
                  state.categoryId === 3
                    ? 'view-types__category-list-item active'
                    : 'view-types__category-list-item'
                }
                data-catid='3'
                onClick={e => categoryClick(e)}>
                Accessories
              </li>
            </ul>
            <ul className='view-types__list'>
              {views
                .filter(view => view.categoryId === state.categoryId)
                .map(view => (
                  <li
                    onClick={() => changeViewType(view.viewId)}
                    key={view.viewId}
                    className='view-types__list-item'>
                    <img src={view.categorySrc} alt=''></img>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : null}
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
