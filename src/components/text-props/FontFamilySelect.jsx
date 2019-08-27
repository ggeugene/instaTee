import React, { Component } from 'react'
import Select from 'react-select'
import { setTextFont } from '../../actions'
import { connect } from 'react-redux'
import '../../fonts/fonts.css'

const options = [
  { value: 'Sans-serif', label: 'Sans-serif' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
]

class FontFamilySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: {
        value: this.props.fontFamily,
        label: this.props.fontFamily,
      },
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
    const customStyles = {
      option: (styles, { data }) => ({ ...styles, fontFamily: data.label }),
      singleValue: (styles, { data }) => ({
        ...styles,
        fontFamily: data.label,
      }),
    }
    return (
      <div
        style={{
          display: 'inline-block',
          width: '66.66667%',
          maxWidth: '66.66667%',
        }}>
        <div>
          <span className='setting-label'>Font Family</span>
        </div>
        <Select
          id='font-family'
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          styles={customStyles}
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
