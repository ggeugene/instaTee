import React, { Component } from 'react'
import iconDesign from '../img/icons/icon-design.png'

export class AddDesign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false,
    }

    this.displayDesign = this.displayDesign.bind(this)
  }

  displayDesign(e) {
    if (this.state.display && !e.target.closest('.design-container')) {
      this.setState({ display: false })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.displayDesign)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.displayDesign)
  }

  render() {
    return (
      <div
        className={
          this.state.display ? 'tools-button__container active' : 'tools-button__container'
        }
        onClick={e => {
          e.stopPropagation()
          if (!e.target.closest('.design-container'))
            this.setState({ display: !this.state.display })
        }}>
        <div className='tools-button__icon'>
          <img src={iconDesign} alt='design' />
        </div>
        <span className='tools-button__text primary-text-color'>Design</span>
        {this.state.display ? (
          <div className='design-container'>
            <span className='uploads-title primary-text-color'>Choose print</span>
          </div>
        ) : null}
      </div>
    )
  }
}

export default AddDesign
