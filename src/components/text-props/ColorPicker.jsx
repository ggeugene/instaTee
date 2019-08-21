import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { setTextColor, setStrokeColor } from '../../actions'
import { connect } from 'react-redux'

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

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '20px',
          height: '20px',
          background: this.state.color,
        },
        swatch: {
          background: '#fff',
          border: '1px solid #dbdbdb',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
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
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
              // onChangeComplete={this.changeComplete}
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
