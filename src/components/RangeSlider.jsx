import React, { Component } from 'react'
import '../css/range-slider.css'
import { connect } from 'react-redux'
import { setImageProp } from '../actions'

class RangeSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDragging: false,
      value: props.focused ? props.focused.value : props.value || 0,
    }
    this.value = props.focused ? props.focused.value : props.value || 0

    this.shiftX = 0
    this.thumbRef = null
    this.sliderRef = null

    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)

    this.calcNewThumbPosition = this.calcNewThumbPosition.bind(this)
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
      const { min, max, sliderId } = this.props
      let newLeft = this.calcNewThumbPosition(e)
      let sliderRect = this.sliderRef.getBoundingClientRect()
      let thumbRect = this.thumbRef.getBoundingClientRect()

      // this.thumbRef.style.left = newLeft + 'px'
      let value =
        min + (max - min) * (newLeft / (sliderRect.width - thumbRect.width))
      this.value = value
      this.setState({ value: value.toFixed(2) })

      let layerImages = document.querySelectorAll('.focused-layer img')
      let filter = ''

      switch (sliderId) {
        case 'brightness':
          filter += `brightness(${value})`
          break
        case 'contrast':
          filter += `contrast(${value}%)`
          break
        case 'hue':
        default:
          filter += `hue-rotate(${value}deg)`
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

  componentDidMount() {
    const { min, max } = this.props
    let sliderRect = this.sliderRef.getBoundingClientRect()
    let thumbRect = this.thumbRef.getBoundingClientRect()

    let newLeft =
      ((this.state.value - min) / (max - min)) *
      (sliderRect.width - thumbRect.width)

    this.thumbRef.style.left = newLeft + 'px'

    window.addEventListener('mouseup', this.mouseUpHandler)
    window.addEventListener('mousemove', this.mouseMoveHandler)
  }
  componentDidUpdate() {
    const { min, max } = this.props
    let sliderRect = this.sliderRef.getBoundingClientRect()
    let thumbRect = this.thumbRef.getBoundingClientRect()

    let newLeft =
      ((this.state.value - min) / (max - min)) *
      (sliderRect.width - thumbRect.width)

    this.thumbRef.style.left = newLeft + 'px'
  }

  render() {
    let { classes, focused } = this.props
    classes += ' slider'
    console.log(focused)
    return (
      <div className='range-slider'>
        <label>
          {this.props.label}: {this.state.value}
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
