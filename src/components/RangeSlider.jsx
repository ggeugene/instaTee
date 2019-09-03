import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setImageProp } from '../actions'

class RangeSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDragging: false,
      value: parseFloat(props.value.toFixed(2)) || 0,
    }
    this.value = parseFloat(props.value.toFixed(2)) || 0

    this.shiftX = 0
    this.thumbRef = null
    this.sliderRef = null

    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)

    this.calcNewThumbPosition = this.calcNewThumbPosition.bind(this)
    this.setThumbPositionOnUpdate = this.setThumbPositionOnUpdate.bind(this)
  }

  calcNewThumbPosition(e) {
    let newLeft =
      e.clientX - this.shiftX - this.sliderRef.getBoundingClientRect().left

    if (newLeft < 0) {
      newLeft = 0
    }
    let rightEdge = this.sliderRef.offsetWidth - this.thumbRef.offsetWidth
    if (newLeft > rightEdge) {
      newLeft = rightEdge
    }
    return newLeft
  }

  mouseDownHandler(e) {
    e.persist()
    if (e.button !== 0) return
    this.shiftX = e.clientX - this.thumbRef.getBoundingClientRect().left
    this.setState({ isDragging: true }, () => {
      if (e.target === this.sliderRef) {
        const { min, max } = this.props
        let thumbRect = this.thumbRef.getBoundingClientRect()
        let sliderRect = this.sliderRef.getBoundingClientRect()

        this.shiftX = thumbRect.width / 2
        let newLeft = this.calcNewThumbPosition(e)

        this.thumbRef.style.left = newLeft + 'px'
        let value =
          min + (max - min) * (newLeft / (sliderRect.width - thumbRect.width))
        this.setState({ value: value.toFixed(2) })
      }
    })
  }

  mouseMoveHandler(e) {
    if (this.state.isDragging) {
      const { min, max, sliderId, focused } = this.props
      let newLeft = this.calcNewThumbPosition(e)
      let sliderRect = this.sliderRef.getBoundingClientRect()
      let thumbRect = this.thumbRef.getBoundingClientRect()

      let value =
        min + (max - min) * (newLeft / (sliderRect.width - thumbRect.width))
      value = parseFloat(value.toFixed(2))
      this.value = value
      this.setState({ value: value })

      let layerImages = document.querySelectorAll('.focused-layer img')
      let filter = ''

      switch (sliderId) {
        case 'brightness':
          filter = `brightness(${value}) contrast(${focused.props.contrast}%) hue-rotate(${focused.props.hue}deg)`
          break
        case 'contrast':
          filter = `brightness(${focused.props.brightness}) contrast(${value}%) hue-rotate(${focused.props.hue}deg)`
          break
        case 'hue':
        default:
          filter = `brightness(${focused.props.brightness}) contrast(${focused.props.contrast}%) hue-rotate(${value}deg)`
      }
      layerImages.forEach(img => {
        img.style.filter = filter
      })
    }
  }
  mouseUpHandler(e) {
    if (this.state.isDragging) {
      const { setImageProp, focused, sliderId } = this.props
      setImageProp(focused.id, this.value, sliderId)
      this.setState({ isDragging: false })
    }
  }

  getInitialThumbLeft() {
    const sliderRect = this.sliderRef.getBoundingClientRect()
    const thumbRect = this.thumbRef.getBoundingClientRect()
    return sliderRect.width / 2 - thumbRect.width / 2
  }

  setThumbPositionOnUpdate() {
    const { min, max } = this.props
    let sliderRect = this.sliderRef.getBoundingClientRect()
    let thumbRect = this.thumbRef.getBoundingClientRect()

    let newLeft =
      ((this.state.value - min) / (max - min)) *
      (sliderRect.width - thumbRect.width)

    this.thumbRef.style.left = newLeft + 'px'
  }

  componentDidMount() {
    this.setThumbPositionOnUpdate()

    window.addEventListener('mouseup', this.mouseUpHandler)
    window.addEventListener('mousemove', this.mouseMoveHandler)
  }
  componentDidUpdate() {
    this.setThumbPositionOnUpdate()
  }

  render() {
    let { classes, label, sliderId } = this.props
    let value
    classes += ' slider'
    switch (sliderId) {
      case 'brightness':
        value = (this.state.value - 1) * 100
        break
      case 'contrast':
        value = this.state.value - 100
        break
      case 'hue':
        value = this.state.value / 3.6
        break
      default:
        value = this.state.value
    }
    value = value.toFixed(2)
    return (
      <div className='range-slider'>
        <label>
          {label}: {value}
        </label>
        <div
          className={classes}
          ref={ref => (this.sliderRef = ref)}
          onMouseDown={this.mouseDownHandler}>
          <div
            className='thumb'
            ref={ref => (this.thumbRef = ref)}
            onDragStart={() => {
              return false
            }}
            data-value={this.state.value}
            onMouseDown={this.mouseDownHandler}
          />
        </div>
      </div>
    )
  }
}

RangeSlider = connect(
  null,
  { setImageProp }
)(RangeSlider)

export default RangeSlider
