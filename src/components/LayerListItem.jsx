import React from 'react'
import { connect } from 'react-redux'
import { setVisibility } from '../actions'

function LayerListItem(props) {
  const { type, content, dragHandleProps, id, setSettingsStyle } = props
  const styles = {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #dbdbdb',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px 10px',
    backgroundColor: '#ffffff',
  }
  const handleVisibilityClick = () => {
    const { hidden, setVisibility } = props
    setVisibility(id, !hidden)
  }
  return type === 'image' ? (
    <div style={styles} data-dragid={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        H
      </div>
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundImage: `url(${content})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #dbdbdb',
        }}
      />
      <div>{props.fileName.length > 13 ? props.fileName.slice(0, 10) + '...' : props.fileName}</div>
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
    <div style={styles} data-dragid={id}>
      <div className='visibility-toggle' onClick={handleVisibilityClick}>
        H
      </div>
      <div>A</div>
      <div>
        {content && (content + '...').length > 13
          ? content.slice(0, 10) + '...'
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
