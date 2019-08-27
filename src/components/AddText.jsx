import React, { Component } from 'react'
import { addText, moveLayer } from '../actions'
import { connect } from 'react-redux'

class AddText extends Component {
  render() {
    const { addText } = this.props
    return (
      <div>
        <button onClick={addText} id='add-text-layer'>
          Add text
        </button>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  addText: () =>
    dispatch(addText()).then(id => {
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
  null,
  mapDispatchToProps
)(AddText)
export default AddText
