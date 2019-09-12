import React from 'react'
import reactCSS from 'reactcss'
import { setTextColor, setStrokeColor } from '../../actions'
import { connect } from 'react-redux'
import InputMask from 'react-input-mask'
import CustomColorPicker from './CustomColorPicker'

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: this.props.color,
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = color => {
    this.setState({ color: color.hex }, () => {
      const { setTextColor, setStrokeColor, action, layerId } = this.props
      if (action === 'fill') {
        setTextColor(layerId, color.hex)
      } else if (action === 'stroke') {
        setStrokeColor(layerId, color.hex)
      }
    })
  }

  handleInputChange = e => {
    e.persist()
    let value = e.target.value.toString()
    this.setState({ color: e.target.value }, () => {
      if (value.length === 7 || value.length === 4) {
        const { setTextColor, setStrokeColor, action, layerId } = this.props
        if (action === 'fill') {
          setTextColor(layerId, e.target.value)
        } else if (action === 'stroke') {
          setStrokeColor(layerId, e.target.value)
        }
      }
    })
  }

  render() {
    const { title } = this.props
    const styles = reactCSS({
      default: {
        color: {
          width: '21px',
          height: '21px',
          background: this.state.color,
        },
        swatch: {
          background: '#fff',
          display: 'inline-block',
          border: '1px solid #c3c1c8',
          cursor: 'pointer',
          marginRight: '12px',
        },
        popover: {
          position: 'absolute',
          zIndex: '202',
          left: '-322px',
          top: '25px',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    })

    return (
      <div>
        <div>
          <span className='setting-label'>{title} color</span>
        </div>
        <div className='flex-row flex-start'>
          <div style={styles.swatch} onClick={this.handleClick}>
            <div style={styles.color} />
          </div>
          <InputMask
            spellCheck='false'
            type='text'
            mask='#xxxxxx'
            maskChar={''}
            value={this.state.color}
            formatChars={{ x: '[A-F|a-f|0-9]', '#': '#' }}
            onChange={this.handleInputChange}
            className='input-color'
            placeholder='#000000'
          />

          {this.state.displayColorPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose} />
              <CustomColorPicker
                color={this.state.color}
                onChange={this.handleChange}
                disableAlpha={true}
                title={title}
                style={styles => ({
                  ...styles,
                  boxShadow: 'none',
                  borderRadius: 0,
                })}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setTextColor: (id, colorHex) => dispatch(setTextColor(id, colorHex)),
  setStrokeColor: (id, colorHex) => dispatch(setStrokeColor(id, colorHex)),
})

export default connect(
  null,
  mapDispatchToProps
)(ColorPicker)
