import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTextContent } from '../../actions'

// function TextInput(props) {
//   const [value, setValue] = useState(props.content)
//   const { layerId, content, setTextContent } = props
//   const input = useRef(null)

//   const handleChange = () => {
//     setValue(input.current.value)
//     // setTextContent(layerId, input.current.value)
//   }
//   return (
//     <div>
//       <label htmlFor='text-input'>Text input</label>
//       <input
//         type='text'
//         value={value}
//         id='text-input'
//         onChange={handleChange}
//       />
//     </div>
//   )
// }

const mapDispatchToProps = dispatch => ({
  setTextContent: (id, content) => dispatch(setTextContent(id, content)),
})

// export default connect(
//   null,
//   mapDispatchToProps
// )(TextInput)

class TextInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.content,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const { layerId, setTextContent } = this.props

    this.setState({ value: e.target.value }, () => {
      setTextContent(layerId, this.state.value)
    })
  }

  render() {
    const { layerId } = this.props
    return (
      <div>
        <label htmlFor='text-input'>Text input</label>
        <input
          key={layerId}
          type='text'
          value={this.state.value}
          id='text-input'
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps
)(TextInput)
