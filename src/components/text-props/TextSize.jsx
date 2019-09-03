import React, { useState, useRef, useEffect } from 'react'
import { setTextSize } from '../../actions'
import { connect } from 'react-redux'
import MaskedInput from 'react-editmask'
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../constants'

function TextSize(props) {
  const [value, setValue] = useState(props.fontSize)
  const { layerId, setTextSize, getNewCoords, coords, rotateAngle } = props
  const input = useRef(null)

  useEffect(() => {
    setValue(props.fontSize)
  }, [props.fontSize])

  const deselectAll = () => {
    if (document.selection) {
      document.selection.empty()
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }
  }

  const applyFontSize = value => {
    const layer = document.querySelector(`[data-id="${layerId}"]`)
    layer.style.fontSize = value + 'px'
  }

  const handleChange = e => {
    let newCoords = {}
    let value = Math.floor(parseFloat(e.target.value) * 100) / 100
    if (value > MAX_FONT_SIZE) value = MAX_FONT_SIZE
    if (value < 1) value = 1
    if (isNaN(value)) value = ''
    if (value < MIN_FONT_SIZE) {
      setValue(value)
      return
    }
    newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
      applyFontSize(value)
    )
    setValue(value)
    setTextSize(layerId, value, newCoords)
  }
  const handleSize = e => {
    e.persist()
    deselectAll()
    let newCoords = {}
    const sign = e.target.dataset.sign
    let value = parseFloat(input.current.value)

    if (sign === '+') {
      value = ++value
      if (value > MAX_FONT_SIZE) value = MAX_FONT_SIZE
      newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
        applyFontSize(value)
      )
      setValue(value)
    } else if (sign === '-') {
      value = --value
      if (value > MAX_FONT_SIZE) value = MAX_FONT_SIZE
      if (value < 1) value = 1
      if (value < MIN_FONT_SIZE) {
        setValue(value)
        return
      }
      newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
        applyFontSize(value)
      )
      setValue(value)
    }
    setTextSize(layerId, value, newCoords)
  }
  const handleBlur = () => {
    if (!value) {
      setValue(props.fontSize)
    }
  }
  return (
    <div className='text-size__container'>
      <div>
        <span className='setting-label'>Text size</span>
      </div>
      <div className='flex-row'>
        <span
          data-sign='-'
          className='size-control size-decrease'
          onClick={handleSize}>
          -
        </span>
        <MaskedInput
          mask='dd?d?(/.d?d?)?'
          onChange={handleChange}
          onBlur={handleBlur}
          id='text-size'
          ref={input}
          value={value}
        />

        <span
          data-sign='+'
          className='size-control size-increase'
          onClick={handleSize}>
          +
        </span>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setTextSize: (id, value, coords) => dispatch(setTextSize(id, value, coords)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextSize)
