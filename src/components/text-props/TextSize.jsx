import React, { useState, useRef } from 'react'
import { setTextSize } from '../../actions'
import { connect } from 'react-redux'

function TextSize(props) {
  const [value, setValue] = useState(props.fontSize)
  const { layerId, setTextSize } = props
  const input = useRef(null)

  const handleChange = () => {
    setValue(input.current.value)
    setTextSize(layerId, input.current.value)
  }
  return (
    <div
      style={{
        display: 'inline-block',
        width: '33.33334%',
        maxWidth: '33.33334%',
      }}>
      <span className='setting-label'>Text size</span>
      <input
        type='text'
        id='text-size'
        value={value}
        ref={input}
        onChange={handleChange}
      />
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setTextSize: (id, content) => dispatch(setTextSize(id, content)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextSize)
