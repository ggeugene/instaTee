import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { setTextContent } from '../../actions'

function TextInput(props) {
  const [value, setValue] = useState(props.content)
  const { layerId, setTextContent } = props
  const input = useRef(null)

  const handleChange = () => {
    setValue(input.current.value)
    setTextContent(layerId, input.current.value)
  }
  return (
    <div className='settings-row'>
      <div>
        <span className='setting-label'>Text input</span>
      </div>
      <input
        type='text'
        value={value}
        id='text-input'
        onChange={handleChange}
        ref={input}
      />
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setTextContent: (id, content) => dispatch(setTextContent(id, content)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextInput)
