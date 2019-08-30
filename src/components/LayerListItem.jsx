import React from 'react'
import { connect } from 'react-redux'
import { setVisibility } from '../actions'

function LayerListItem(props) {
  const { type, content } = props
  const styles = {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #dbdbdb',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px 10px',
  }
  const handleVisibilityClick = () => {
    const { hidden, setVisibility, id } = props
    setVisibility(id, !hidden)
  }
  return type === 'image' ? (
    <div style={styles}>
      <div onClick={handleVisibilityClick}>H</div>
      <div
        style={{
          width: '30px',
          height: '30px',
          backgroundImage: `url(${content})`,
          backgroundSize: 'cover',
        }}
      />
      <div>
        {props.fileName.length > 13
          ? props.fileName.slice(0, 10) + '...'
          : props.fileName}
      </div>
      <div>drag</div>
    </div>
  ) : (
    <div style={styles}>
      <div onClick={handleVisibilityClick}>H</div>
      <div>A</div>
      <div>
        {content && content.length > 13
          ? content.slice(0, 10) + '...'
          : content
          ? content
          : `Text layer ${props.id}`}
      </div>
      <div>drag</div>
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
