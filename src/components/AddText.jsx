import React, { Component } from 'react'
import { addText } from '../actions'
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
  addText: () => dispatch(addText()),
})
AddText = connect(
  null,
  mapDispatchToProps
)(AddText)
export default AddText
