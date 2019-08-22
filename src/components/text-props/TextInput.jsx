import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { setTextContent } from '../../actions'

function TextInput(props) {
  const [value, setValue] = useState(props.content)
  const { layerId, setTextContent, getNewCoords, coords, rotateAngle } = props
  const input = useRef(null)

  const applyTextContent = content => {
    const layer = document.querySelector(`[data-id="${layerId}"]`).children[0]
    layer.innerHTML = content
  }

  const handleChange = () => {
    let newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
      applyTextContent(input.current.value)
    )
    setValue(input.current.value)
    setTextContent(layerId, input.current.value, newCoords)
  }
  return (
    <div className='settings-row'>
      <div>
        <span className='setting-label'>Text input</span>
      </div>
      <textarea
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
  setTextContent: (id, content, coords) =>
    dispatch(setTextContent(id, content, coords)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextInput)
