import React from 'react'
import { connect } from 'react-redux'
import { setTextType } from '../../actions'

function TextType(props) {
  let types = { ...props.types }
  const { layerId, setTextType, getNewCoords, coords, rotateAngle } = props

  const applyTextType = type => {
    const layer = document.querySelector(`[data-id="${layerId}"]`).children[0]
    switch (type) {
      case 'bold':
        layer.style.fontWeight = types[type] ? 'bold' : 'normal'
        break
      case 'italic':
        layer.style.fontStyle = types[type] ? 'italic' : 'normal'
        break
      case 'underline':
        layer.style.textDecoration = types[type] ? 'underline' : 'none'
        break
      default:
        break
    }
  }

  const setType = type => {
    types[type] = !types[type]

    let newCoords = getNewCoords(layerId, coords, rotateAngle, () =>
      applyTextType(type)
    )

    setTextType(layerId, types, newCoords)
  }
  return (
    <div>
      <div>
        <span className='setting-label'>Text type</span>
      </div>
      <span
        className='type-span'
        style={{ opacity: props.types.bold === true ? 1 : 0.4 }}
        onClick={() => setType('bold')}>
        B
      </span>
      <span
        className='type-span'
        style={{ opacity: props.types.italic === true ? 1 : 0.4 }}
        onClick={() => setType('italic')}>
        I
      </span>
      <span
        className='type-span'
        style={{ opacity: props.types.underline === true ? 1 : 0.4 }}
        onClick={() => setType('underline')}>
        U
      </span>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setTextType: (id, types, coords) => dispatch(setTextType(id, types, coords)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextType)
