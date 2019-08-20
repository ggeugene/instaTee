import React from 'react'
import { connect } from 'react-redux'
import { setTextAlign } from '../../actions'

function TextAlign(props) {
  return (
    <div
      style={{
        display: 'inline-block',
        maxWidth: '50%',
        width: '50%',
      }}>
      <label>Text align</label>
      <span
        className='align-span'
        style={{ opacity: props.align === 'left' ? 1 : 0.4 }}
        onClick={() => props.setTextAlign(props.layerId, 'left')}>
        left
      </span>
      <span
        className='align-span'
        style={{ opacity: props.align === 'center' ? 1 : 0.4 }}
        onClick={() => props.setTextAlign(props.layerId, 'center')}>
        center
      </span>
      <span
        className='align-span'
        style={{ opacity: props.align === 'right' ? 1 : 0.4 }}
        onClick={() => props.setTextAlign(props.layerId, 'right')}>
        right
      </span>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setTextAlign: (id, align) => dispatch(setTextAlign(id, align)),
})

export default connect(
  null,
  mapDispatchToProps
)(TextAlign)
