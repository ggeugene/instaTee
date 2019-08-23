import React, { Component } from 'react'
import Select from 'react-select'
import { setTextFont } from '../../actions'
import { connect } from 'react-redux'
import '../../fonts/fonts.css'

const options = [
  { value: 'san-serif', label: 'San-serif' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
]

class FontFamilySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: options[0],
    }
    this.apllyFontFamily = this.apllyFontFamily.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  apllyFontFamily(fontFamily) {
    const { layerId } = this.props
    const layer = document.querySelector(`[data-id="${layerId}"]`).children[0]
    layer.style.fontFamily = fontFamily
  }

  handleChange(selectedOption) {
    let newCoords = {}
    const {
      layerId,
      setTextFont,
      getNewCoords,
      coords,
      rotateAngle,
    } = this.props
    newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
      this.apllyFontFamily(selectedOption.label)
    )
    this.setState({ selectedOption })
    setTextFont(layerId, selectedOption.label, newCoords)
  }

  render() {
    const { selectedOption } = this.state
    return (
      <div
        style={{
          display: 'inline-block',
          width: '66.66667%',
          maxWidth: '66.66667%',
        }}>
        <label htmlFor='font-family'>Font Family</label>
        <Select
          id='font-family'
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setTextFont: (id, fontFamily, coords) =>
    dispatch(setTextFont(id, fontFamily, coords)),
})

export default connect(
  null,
  mapDispatchToProps
)(FontFamilySelect)
