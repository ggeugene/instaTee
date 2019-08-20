import React, { Component } from 'react'
import Select from 'react-select'

const options = [
  { value: 'san-serif', label: 'San-serif' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'open-sans', label: 'Open Sans' },
]

class FontFamilySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: options[0],
    }
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption })
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

export default FontFamilySelect
