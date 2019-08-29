import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { setTextColor, setStrokeColor } from '../../actions'
import { connect } from 'react-redux'
import InputMask from 'react-input-mask'

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
    const styles = reactCSS({
      default: {
        color: {
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: this.state.color,
        },
        swatch: {
          background: '#fff',
          display: 'inline-block',
          borderRadius: '50%',
          border: '1px solid #dbdbdb',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          bottom: '30px',
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
      <div className='settings-row'>
        <div>
          <span className='setting-label'>{this.props.title} color</span>
        </div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        <InputMask
          type='text'
          mask='\#xxxxxx'
          maskChar={''}
          value={this.state.color}
          formatChars={{ x: '[A-F|a-f|0-9]' }}
          onChange={this.handleInputChange}
        />

        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
              disableAlpha={true}
            />
          </div>
        ) : null}
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
