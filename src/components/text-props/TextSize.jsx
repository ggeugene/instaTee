import React from 'react'

function TextSize(props) {
  return (
    <div
      style={{
        display: 'inline-block',
        width: '33.33334%',
        maxWidth: '33.33334%',
      }}>
      <span className='setting-label'>Text size</span>
      <input type='text' id='text-size' value={props.fontSize} />
    </div>
  )
}

export default TextSize
