import React from 'react'
import { connect } from 'react-redux'
import { setTextAlign } from '../../actions'

function TextAlign(props) {
  return (
    <div>
      <div>
        <span className='setting-label'>Text align</span>
      </div>
      <div className='flex-row'>
        <span
          className={props.align === 'left' ? 'align-span left-align active' : 'align-span left-align'}
          onClick={() => props.setTextAlign(props.layerId, 'left')}>
          <span className='left-line'></span>
          <span className='left-line'></span>
          <span className='left-line'></span>
        </span>
        <span
          className={props.align === 'center' ? 'align-span center-align active' : 'align-span center-align'}
          onClick={() => props.setTextAlign(props.layerId, 'center')}>
          <span className='center-line'></span>
          <span className='center-line'></span>
          <span className='center-line'></span>
        </span>
        <span
          className={props.align === 'right' ? 'align-span right-align active' : 'align-span right-align'}
          onClick={() => props.setTextAlign(props.layerId, 'right')}>
          <span className='right-line'></span>
          <span className='right-line'></span>
          <span className='right-line'></span>
        </span>
      </div>
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
