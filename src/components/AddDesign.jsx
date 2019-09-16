import React, { Component } from 'react'
import iconDesign from '../img/icons/icon-design.png'
import iconDesignGreen from '../img/icons/icon-design_green.png'

export class AddDesign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false,
    }
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
          <div
            style={{ backgroundImage: `url(${iconDesignGreen})` }}
            className='tools-button__icon-container'>
            <img src={iconDesign} alt='text' className='icon-black' />
          </div>
        </div>
        <span className='tools-button__text primary-text-color'>Design</span>
        {this.state.display ? (
          <div>
            <div className='design-wrapper'></div>
            <div className='design-container'>
              <span className='uploads-title primary-text-color'>Choose print</span>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

export default AddDesign
