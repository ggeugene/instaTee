import React, { Component } from 'react'
import withLayerMethods from './withLayerMethods'
import LayerText from './LayerText'

class DraggableText extends Component {
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
    }
    let className = 'single-layer__container text-layer'
    className += isFocused ? ' focused-layer' : ''

    let element = controls ? (
      <div
        onMouseDown={e => {
          hocMethods.setLayerFocus()
          hocMethods.dragMouseDown(e)
        }}
        className={className}
        style={{ ...styles, opacity: isFocused ? 1 : 0 }}
        ref={div => setLayerRef(div)}
        data-id={id}>
        <LayerText content={content} opacity={0.2} properties={props} />
        <div
          className='transform-layer rotate-layer'
          onMouseDown={hocMethods.rotateMouseDown}
          onMouseUp={hocMethods.rotateMouseUp}>
          R
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
          D
        </div>
        <div
          className='transform-layer center-layer'
          onClick={hocMethods.centerLayer}>
          C
        </div>
        <div
          className='transform-layer stretch-layer'
          onClick={hocMethods.stretchLayer}>
          [ ]
        </div>
        <div className='corners'>
          <div
            className='corner top-left'
            ref={div => setCornerRef('topLeft', div)}
          />
          <div
            className='corner top-right'
            ref={div => setCornerRef('topRight', div)}
          />
          <div
            className='corner bottom-right'
            ref={div => setCornerRef('bottomRight', div)}
          />
          <div
            className='corner bottom-left'
            ref={div => setCornerRef('bottomLeft', div)}
          />
        </div>
      </div>
    ) : (
      <div
        onMouseDown={hocMethods.dragMouseDown}
        className={className}
        style={styles}
        ref={div => setLayerRef(div)}
        data-id={id}>
        <LayerText content={content} properties={props} back={true} />
      </div>
    )

    return element
  }
}

export default withLayerMethods(DraggableText)
