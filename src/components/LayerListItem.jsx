import React from 'react'

function LayerListItem(props) {
	const { type, content } = props
  const styles = {
		display: 'flex',
		flexDirection: 'row',
		border: '1px solid #dbdbdb',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '10px',
  }
	return type === 'image' ? (
    <div style={styles}>
      <div>H</div>
      <div style={{ width: '30px', height: '30px', backgroundImage: `url(${content})`, backgroundSize: 'cover' }} />
      <div>{props.fileName.length > 13 ? props.fileName.slice(0, 10) + '...' : props.fileName}</div>
      <div>drag</div>
    </div>
  ) : (
    <div style={styles}>
      <div>H</div>
      <div style={{ width: '30px', height: '30px'}}>A</div>
      <div>{content && content.length > 13 ? content.slice(0, 10) + '...' : content ? content : `Text layer ${props.id}`}</div>
      <div>drag</div>
    </div>
  );
}

export default LayerListItem
