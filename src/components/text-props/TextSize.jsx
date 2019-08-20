import React from 'react'

function TextSize(props) {
  return (
    <div
      style={{
        display: 'inline-block',
        width: '33.33334%',
        maxWidth: '33.33334%',
      }}>
      <label htmlFor='text-size'>Text size</label>
      <input type='text' id='text-size' value={props.fontSize} />
    </div>
  )
}

export default TextSize
