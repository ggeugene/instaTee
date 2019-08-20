import React from 'react'
import { connect } from 'react-redux'
import { setTextType } from '../../actions'

function TextType(props) {
  let types = { ...props.types }
  const { layerId, setTextType } = props

  const setType = type => {
    types[type] = !types[type]

    setTextType(layerId, types)
  }
  return (
    <div
      style={{
        display: 'inline-block',
        maxWidth: '50%',
        width: '50%',
      }}>
      <label>Text type</label>
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
  setTextType: (id, types) => dispatch(setTextType(id, types)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextType)
