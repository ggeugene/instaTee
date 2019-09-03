import React from 'react'
import { connect } from 'react-redux'
import { setVisibility } from '../actions'

function LayerListItem(props) {
  const { type, content, dragHandleProps, id, setSettingsStyle } = props

  const handleVisibilityClick = () => {
    const { hidden, setVisibility } = props
    setVisibility(id, !hidden)
  }
  return type === 'image' ? (
    <div className='single-list-item' data-id={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        H
      </div>
      <div
        className='list-item__preview image-preview'
        style={{ backgroundImage: `url(${content})` }}
      />
      <div className='primary-text-color text-preview__content'>
        {props.fileName.length > 20
          ? props.fileName.slice(0, 17) + '...'
          : props.fileName}
      </div>
      <div
        className='drag-item__container'
        onMouseUp={() => setSettingsStyle(id, true)}
        {...dragHandleProps}>
        <div className='drag-line'></div>
        <div className='drag-line'></div>
        <div className='drag-line'></div>
      </div>
    </div>
  ) : (
    <div className='single-list-item' data-id={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        H
      </div>
      <div className='list-item__preview highlight-text text-preview'>A</div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: 500,
          lineHeight: 1.47,
          letterSpacing: '0.75px',
        }}
        className='primary-text-color text-preview__content'>
        {content && (content + '...').length > 20
          ? content.slice(0, 17) + '...'
          : content
          ? content
          : `Text layer ${props.id}`}
      </div>
      <div
        className='drag-item__container'
        onMouseUp={() => setSettingsStyle(id, true)}
        {...dragHandleProps}>
        <div className='drag-line'></div>
        <div className='drag-line'></div>
        <div className='drag-line'></div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setVisibility: (id, hidden) => dispatch(setVisibility(id, hidden)),
})

export default connect(
  null,
  mapDispatchToProps
)(LayerListItem)
