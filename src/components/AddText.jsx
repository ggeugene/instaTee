import React, { Component } from 'react'
import { addText, moveLayer } from '../actions'
import { connect } from 'react-redux'
import iconText from '../img/icons/icon-text.png'

class AddText extends Component {
  render() {
    const { addText, activeView } = this.props
    return (
      <div onClick={() => addText(activeView)} className='tools-button__container'>
        <div className='tools-button__icon'>
          <img src={iconText} alt=''></img>
        </div>
        <span id='add-text-layer' className='tools-button__text primary-text-color'>
          Text
        </span>
      </div>
    )
  }
}

const mapStateToProps = state => ({ activeView: state.activeView })

const mapDispatchToProps = dispatch => ({
  addText: activeView =>
    dispatch(addText(activeView)).then(id => {
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
