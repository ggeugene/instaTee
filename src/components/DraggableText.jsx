import React, { Component } from 'react'
import withLayerMethods from './withLayerMethods'
import LayerText from './LayerText'
import iconDelete from '../img/icons/icon-delete.png'
import iconRotate from '../img/icons/icon-change_view.png'

class DraggableText extends Component {
  constructor(props) {
    super(props)

    this.setInputFocus = this.setInputFocus.bind(this)
  }

  setInputFocus() {
    const textarea = document.querySelector('textarea')
    const value = textarea.value
    textarea.value = ''
    textarea.focus()
    textarea.value = value
  }

  render() {
    const {
      id,
      coords,
      size,
      content,
      zIndex,
      rotateAngle,
      isFocused,
      controls,
      props,
      hocMethods,
      setLayerRef,
      setCornerRef,
      hidden,
    } = this.props
    let styles = {
      width: size.width,
      height: size.height,
      top: coords.y + 'px',
      left: coords.x + 'px',
      zIndex: isFocused ? zIndex + 2000 : zIndex,
      position: 'absolute',
      transform: `rotate(${rotateAngle.degree}deg)`,
      willChange: 'opacity',
      fontSize: props.fontSize + 'px',
      visibility: hidden ? 'hidden' : 'visible',
    }
    let className = 'single-layer__container text-layer'
    className += isFocused ? ' focused-layer' : ''

    let element = controls ? (
      <div
        onMouseDown={e => {
          hocMethods.setLayerFocus()
          hocMethods.dragMouseDown(e)
        }}
        onDoubleClick={this.setInputFocus}
        className={className}
        style={{ ...styles, opacity: isFocused ? 1 : 0 }}
        ref={div => setLayerRef(div)}
        data-id={id}>
        <LayerText content={content} opacity={0.2} properties={props} />
        <div
          className='transform-layer rotate-layer'
          onMouseDown={hocMethods.rotateMouseDown}
          onMouseUp={hocMethods.rotateMouseUp}>
          <img src={iconRotate} alt='' />
        </div>
        <div
          className='transform-layer resize-layer'
          onMouseDown={hocMethods.transformMouseDown}
          onMouseUp={hocMethods.transformMouseUp}>
          S
        </div>
        <div
          className='transform-layer delete-layer'
          onClick={() => hocMethods.deleteLayer(id, this.props.fileName)}>
          <img src={iconDelete} alt='' />
        </div>
        <div className='corners'>
          <div className='corner top-left' ref={div => setCornerRef('topLeft', div)} />
          <div className='corner top-right' ref={div => setCornerRef('topRight', div)} />
          <div className='corner bottom-right' ref={div => setCornerRef('bottomRight', div)} />
          <div className='corner bottom-left' ref={div => setCornerRef('bottomLeft', div)} />
        </div>
      </div>
    ) : (
      <div
        onMouseDown={hocMethods.dragMouseDown}
        className={className}
        style={styles}
        ref={div => setLayerRef(div)}
        data-id={id}>
        <LayerText content={content} properties={props} />
      </div>
    )

    return element
  }
}

export default withLayerMethods(DraggableText)
