import React, { Component } from 'react'
import ImageList from './ImageList'

class Workspace extends Component {
  constructor(props) {
    super(props)

    this.areaRef = React.createRef()

    this.state = {
      area: this.areaRef,
    }
  }

  componentDidMount() {
    this.setState({ area: this.areaRef })
  }

  render() {
    return (
      <div className='workspace__area' ref={this.areaRef}>
        <div className='layers__container'>
          <ImageList area={this.state.area.current} />
        </div>
      </div>
    )
  }
}

export default Workspace
