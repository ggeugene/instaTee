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

    let newCoords = getNewCoords(layerId, coords, rotateAngle, () => applyTextType(type))

    setTextType(layerId, types, newCoords)
  }
  return (
    <div>
      <div>
        <span className='setting-label type-label'>Text type</span>
      </div>
      <div className='flex-row'>
        <span
          className={props.types.bold ? 'type-span active' : 'type-span'}
          style={{ fontWeight: 'bold' }}
          onClick={() => setType('bold')}>
          B
        </span>
        <span
          className={props.types.italic ? 'type-span active' : 'type-span'}
          style={{ fontStyle: 'italic' }}
          onClick={() => setType('italic')}>
          I
        </span>
        <span
          className={props.types.underline ? 'type-span active' : 'type-span'}
          style={{ textDecoration: 'underline' }}
          onClick={() => setType('underline')}>
          U
        </span>
      </div>
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
