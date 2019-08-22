import React, { useState, useRef } from 'react'
import { setTextSize } from '../../actions'
import { connect } from 'react-redux'

function TextSize(props) {
  const [value, setValue] = useState(props.fontSize)
  const { layerId, setTextSize } = props
  const input = useRef(null)

  const deselectAll = () => {
    if (document.selection) {
      document.selection.empty()
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }
  }

  const handleChange = () => {
    setValue(input.current.value)
    setTextSize(layerId, input.current.value)
  }
  const handleSize = e => {
    e.persist()
    deselectAll()
    const sign = e.target.dataset.sign
    let value = parseFloat(input.current.value)

    if (sign === '+') {
      setValue(++value)
    } else if (sign === '-') {
      setValue(--value)
    }
    setTextSize(layerId, value)
  }
  return (
    <div
      style={{
        display: 'inline-block',
        width: '50%',
        maxWidth: '50%',
      }}>
      <div>
        <span className='setting-label'>Text size</span>
      </div>
      <span
        data-sign='-'
        className='size-control size-decrease'
        onClick={handleSize}>
        -
      </span>
      <input
        type='text'
        id='text-size'
        value={value}
        ref={input}
        onChange={handleChange}
      />

      <span
        data-sign='+'
        className='size-control size-increase'
        onClick={handleSize}>
        +
      </span>
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
