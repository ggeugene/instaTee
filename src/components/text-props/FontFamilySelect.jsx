import React, { Component, ElementConfig } from 'react'
import Select, { components } from 'react-select'
import { setTextFont } from '../../actions'
import { connect } from 'react-redux'
import '../../fonts/fonts.css'

const options = [
  { value: 'Sans-serif', label: 'Sans-serif' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat Alternates', label: 'Montserrat Alternates' },
]

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <img src='https://via.placeholder.com/18x18' alt='' />
    </components.DropdownIndicator>
  )
}

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
      option: (styles, state) => ({
        ...styles,
        fontFamily: state.data.label,
        fontSize: '15px',
        lineHeight: 1.2,
        fontWeight: 'normal',
        minHeight: 'auto',
        padding: '5px 8px',
        color: '#353434',
      }),
      singleValue: (styles, { data }) => ({
        ...styles,
        fontFamily: data.label,
        fontSize: '15px',
        lineHeight: 1.2,
        fontWeight: 'normal',
        margin: 0,
      }),
      indicatorSeparator: styles => ({
        display: 'none',
      }),
      control: styles => ({
        ...styles,
        padding: 0,
        borderWidth: 0,
        minHeight: 'auto',
        boxShadow: 0,
      }),
      indicatorsContainer: styles => ({
        ...styles,
        padding: 0,
      }),
      dropdownIndicator: styles => ({
        ...styles,
        height: '18px',
        width: '18px;',
      }),
      menu: styles => ({
        ...styles,
        margin: 0,
        borderRadius: 0,
      }),
      menuList: styles => ({
        ...styles,
        padding: 0,
      }),
    }
    return (
      <div className='font-family__container'>
        <div>
          <span className='setting-label'>Font Family</span>
        </div>
        <Select
          id='font-family'
          value={selectedOption}
          components={{ DropdownIndicator }}
          onChange={this.handleChange}
          options={options}
          styles={customStyles}
          isSearchable={false}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#bbff47',
              primary25: '#5e8a12',
            },
          })}
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
