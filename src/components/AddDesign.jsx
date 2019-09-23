import React, { Component } from 'react'
import iconDesign from '../img/icons/icon-design.png'
import iconDesignGreen from '../img/icons/icon-design_green.png'
import { connect } from 'react-redux'
import { addImage, resizeImageOnUpload } from '../actions'

export class AddDesign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false,
    }

    this.printImages = []
    this.printClickHandler = this.printClickHandler.bind(this)
  }

  importAll(r) {
    return r.keys().map(r)
  }

  printClickHandler(e) {
    const { addImage } = this.props
    const { viewId, currentView } = this.props.activeView

    let background = e.target.style.backgroundImage
    background = background.slice(background.indexOf('("') + 2, background.lastIndexOf('")'))

    let img = document.createElement('img')
    img.src = background

    img.onload = () => {
      let area = document.querySelector('.workspace__area')
      const newImageSize = resizeImageOnUpload(img, area)

      const pos1 = img.src.lastIndexOf('.')
      const imageFormat = img.src.slice(pos1)
      const imageName = img.src.slice(
        img.src.lastIndexOf('/') + 1,
        img.src.lastIndexOf('.', pos1 - 1)
      )
      let options = {
        content: img.src,
        fileName: imageName + imageFormat,
        size: {
          width: newImageSize.width > img.width ? img.width : newImageSize.width,
          height: newImageSize.height > img.height ? img.height : newImageSize.height,
        },
        originalSize: {
          width: img.width,
          height: img.height,
        },
      }
      addImage({ viewId, currentView }, options)
      this.setState({ display: false })
    }
  }

  componentDidMount() {
    this.printImages = this.importAll(require.context('../img/prints', false, /\.(png|jpe?g|svg)$/))
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
            <div className='design__wrapper'></div>
            <div className='design-container'>
              <span className='uploads-title primary-text-color'>Choose print</span>
              {this.printImages.length ? (
                <ul className='prints-list'>
                  {this.printImages.map((img, index) => (
                    <li
                      key={index}
                      className='prints-list__item'
                      onClick={e => this.printClickHandler(e)}>
                      <div
                        className='prints-list__item__container'
                        style={{ backgroundImage: `url(${img})` }}></div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  activeView: state.views.filter(view => view.isActive)[0],
})

const mapDispatchToProps = dispatch => ({
  addImage: (activeView, imageObject) => dispatch(addImage(activeView, imageObject)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDesign)
