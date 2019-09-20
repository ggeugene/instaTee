import React, { Component } from 'react'
import { addText, moveLayer } from '../actions'
import { connect } from 'react-redux'
import iconText from '../img/icons/icon-text.png'
import iconTextGreen from '../img/icons/icon-text_green.png'

class AddText extends Component {
  render() {
    const { addText } = this.props
    const { viewId, currentView, currentColorId } = this.props.activeView
    const isLight = this.props.activeView.colors[currentColorId].isLight
    return (
      <div
        onClick={() => addText({ viewId, currentView }, isLight ? '#000000' : '#ffffff')}
        className='tools-button__container'>
        <div className='tools-button__icon'>
          <div
            style={{ backgroundImage: `url(${iconTextGreen})` }}
            className='tools-button__icon-container'>
            <img src={iconText} alt='text' className='icon-black' />
          </div>
        </div>
        <span id='add-text-layer' className='tools-button__text primary-text-color'>
          Text
        </span>
      </div>
    )
  }
}

const mapStateToProps = state => ({ activeView: state.views.filter(view => view.isActive)[0] })

const mapDispatchToProps = dispatch => ({
  addText: (activeView, color) =>
    dispatch(addText(activeView, color)).then(id => {
      const area = document.querySelector('.workspace__area')
      const layer = document.querySelector(`[data-id="${id}"]`)
      const layerRect = layer.getBoundingClientRect()
      const areaRect = area.getBoundingClientRect()
      const borderWidth = 1

      const areaCenter = {
        x: (areaRect.width - borderWidth * 2) / 2,
        y: (areaRect.height - borderWidth * 2) / 2,
      }

      const newCoords = {
        x: areaCenter.x - layerRect.width / 2,
        y: areaCenter.y - layerRect.height / 2,
      }
      dispatch(moveLayer(id, newCoords))
    }),
})
AddText = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddText)
export default AddText
