import React from 'react'
import { connect } from 'react-redux'
import { setVisibility } from '../actions'
import iconVisible from '../img/icons/icon-visible.png'
import iconHidden from '../img/icons/icon-hidden.png'
import iconText from '../img/icons/icon-text_green.png'

function LayerListItem(props) {
  const { type, content, dragHandleProps, id, setSettingsStyle, hidden } = props

  const handleVisibilityClick = () => {
    const { setVisibility } = props
    setVisibility(id, !hidden)
  }
  return type === 'image' ? (
    <div className='single-list-item' data-dragid={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        <img
          src={hidden ? iconHidden : iconVisible}
          title='Toggle visibility'
          alt='toggle visibility'
        />
      </div>
      <div
        className='list-item__preview image-preview'
        style={{ backgroundImage: `url(${content})` }}
      />
      <div className='primary-text-color text-preview__content'>
        {props.fileName.length > 20 ? props.fileName.slice(0, 17) + '...' : props.fileName}
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
    <div className='single-list-item' data-dragid={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        <img
          src={hidden ? iconHidden : iconVisible}
          title='Toggle visibility'
          alt='toggle visibility'
        />
      </div>
      <div className='list-item__preview text-preview'>
        <img src={iconText} alt='' />
      </div>
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
