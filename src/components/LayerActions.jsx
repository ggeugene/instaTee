import React from 'react'
import { connect } from 'react-redux'
import { deleteLayer, moveLayer, stretchLayer, resizeText, rotateLayer } from '../actions'
import iconDelete from '../img/icons/icon-delete.svg'
import iconStretch from '../img/icons/icon-stretch.png'
import iconCenterV from '../img/icons/icon-vertical_center.png'
import iconCenterH from '../img/icons/icon-horizontal_center.png'
import iconZeroRotate from '../img/icons/icon-zero_rotate.svg'

function LayerActions(props) {
  const { layer, deleteLayer, rotateLayer } = props

  const getElementCoords = (element, angle, scale = 1) => {
    const elementRect = element.getBoundingClientRect()
    let rotatedTopLeft, rotatedTopRight, rotatedBottomRight, rotatedBottomLeft

    if (angle !== 0) {
      const topLeftRect = document
        .querySelector(`[data-id="${layer.id}"] .corner.top-left`)
        .getBoundingClientRect()
      rotatedTopLeft = {
        y: topLeftRect.top / scale,
        x: topLeftRect.left / scale,
      }
      const topRightRect = document
        .querySelector(`[data-id="${layer.id}"] .corner.top-right`)
        .getBoundingClientRect()
      rotatedTopRight = {
        y: topRightRect.top / scale,
        x: topRightRect.left / scale,
      }
      const bottomRightRect = document
        .querySelector(`[data-id="${layer.id}"] .corner.bottom-right`)
        .getBoundingClientRect()
      rotatedBottomRight = {
        y: bottomRightRect.top / scale,
        x: bottomRightRect.left / scale,
      }
      const bottomLeftRect = document
        .querySelector(`[data-id="${layer.id}"] .corner.bottom-left`)
        .getBoundingClientRect()
      rotatedBottomLeft = {
        y: bottomLeftRect.top / scale,
        x: bottomLeftRect.left / scale,
      }
    } else {
      rotatedTopLeft = {
        y: elementRect.top / scale,
        x: elementRect.left / scale,
      }
      rotatedTopRight = {
        y: elementRect.top / scale,
        x: (elementRect.left + elementRect.width) / scale,
      }
      rotatedBottomRight = {
        y: (elementRect.top + elementRect.height) / scale,
        x: (elementRect.left + elementRect.width) / scale,
      }
      rotatedBottomLeft = {
        y: (elementRect.top + elementRect.height) / scale,
        x: elementRect.left / scale,
      }
    }

    const pointsArray = [rotatedTopLeft, rotatedTopRight, rotatedBottomRight, rotatedBottomLeft]
    return pointsArray
  }

  const getScaleFactor = () => {
    const editor = document.getElementById('editor')
    const area = document.querySelector('.workspace__area')

    return props.zoom
      ? Math.min(
          editor.offsetHeight / area.offsetHeight,
          editor.offsetWidth / area.offsetWidth
        ).toFixed(4)
      : 1
  }

  const centerLayer = direction => {
    const { id, rotateAngle, coords } = layer
    const { moveLayer } = props
    const areaRect = document.querySelector('.workspace__area').getBoundingClientRect()
    const scaleFactor = getScaleFactor()
    const borderWidth = 1
    const size = {}

    const areaCenter = {
      x: (areaRect.width - borderWidth * 2) / 2 / scaleFactor,
      y: (areaRect.height - borderWidth * 2) / 2 / scaleFactor,
    }

    let cornersCoords = getElementCoords(
      document.querySelector(`[data-id="${id}"]`),
      rotateAngle.degree,
      scaleFactor
    )

    size.width = Math.sqrt(
      Math.pow(cornersCoords[0].x - cornersCoords[1].x, 2) +
        Math.pow(cornersCoords[0].y - cornersCoords[1].y, 2)
    )
    size.height = Math.sqrt(
      Math.pow(cornersCoords[1].x - cornersCoords[2].x, 2) +
        Math.pow(cornersCoords[1].y - cornersCoords[2].y, 2)
    )

    let newCoords = {}

    switch (direction) {
      case 'vertical':
        newCoords = {
          x: coords.x,
          y: areaCenter.y - size.height / 2,
        }
        break
      case 'horizontal':
        newCoords = {
          x: areaCenter.x - size.width / 2,
          y: coords.y,
        }
        break
      default:
        newCoords = {
          x: areaCenter.x - size.width / 2,
          y: areaCenter.y - size.height / 2,
        }
    }

    moveLayer(id, newCoords)
  }

  const stretch = () => {
    let { size, coords, id, type, rotateAngle } = layer
    const { stretchLayer, resizeText } = props
    const borderWidth = 1
    let areaRect = document.querySelector('.workspace__area').getBoundingClientRect()
    let element = document.querySelector(`[data-id="${id}"]`)
    let layerRect = element.getBoundingClientRect()
    const scaleFactor = getScaleFactor()
    let newSize = { ...size }
    let y = coords.y
    let x = coords.x

    // minus 1px border width from left and right
    areaRect.width = areaRect.width - borderWidth * 2
    areaRect.height = areaRect.height - borderWidth * 2

    const ratio = Math.min(areaRect.width / layerRect.width, areaRect.height / layerRect.height)

    let fontSize = 1
    let textRatio = 1

    if (type === 'text') {
      fontSize = layer.props.fontSize
      textRatio = Math.min(layerRect.width / fontSize, layerRect.height / fontSize)
      const cornersCoords = getElementCoords(element, rotateAngle.degree, scaleFactor)
      newSize.width = size.width = Math.sqrt(
        Math.pow(cornersCoords[0].x - cornersCoords[1].x, 2) +
          Math.pow(cornersCoords[0].y - cornersCoords[1].y, 2)
      )
      newSize.height = size.height = Math.sqrt(
        Math.pow(cornersCoords[1].x - cornersCoords[2].x, 2) +
          Math.pow(cornersCoords[1].y - cornersCoords[2].y, 2)
      )
    }

    newSize.width = newSize.width * ratio
    newSize.height = newSize.height * ratio

    element.style.width = newSize.width + 'px'
    element.style.height = newSize.height + 'px'

    layerRect = element.getBoundingClientRect()

    if (type === 'text') {
      fontSize = Math.min(layerRect.width / textRatio, layerRect.height / textRatio)
      fontSize = parseFloat(fontSize.toFixed(2))
    }

    if (layerRect.left < areaRect.left) {
      x += (areaRect.left - layerRect.left + borderWidth) / scaleFactor
    } else if (layerRect.left + layerRect.width > areaRect.left + areaRect.width) {
      x -=
        (layerRect.left + layerRect.width - (areaRect.left + areaRect.width) - borderWidth) /
        scaleFactor
    } else {
      x -= (newSize.width - size.width) / 2 / scaleFactor

      //TODO: fix as DRY
      element.style.left = x + 'px'
      layerRect = element.getBoundingClientRect()
      if (layerRect.left < areaRect.left) {
        x += (areaRect.left - layerRect.left + borderWidth) / scaleFactor
      } else if (layerRect.left + layerRect.width > areaRect.left + areaRect.width) {
        x -=
          (layerRect.left + layerRect.width - areaRect.left - areaRect.width - borderWidth) /
          scaleFactor
      }
    }

    layerRect = element.getBoundingClientRect()

    if (layerRect.top < areaRect.top) {
      y += areaRect.top - layerRect.top + borderWidth
    } else if (layerRect.top + layerRect.height > areaRect.top + areaRect.height) {
      y -=
        (layerRect.top + layerRect.height - areaRect.top - areaRect.height - borderWidth) /
        scaleFactor
    } else {
      y -= (newSize.height - size.height) / 2 / scaleFactor

      //TODO: fix as DRY
      element.style.top = y + 'px'
      layerRect = element.getBoundingClientRect()
      if (layerRect.top < areaRect.top) {
        y += (areaRect.top - layerRect.top + borderWidth) / scaleFactor
      } else if (layerRect.top + layerRect.height > areaRect.top + areaRect.height) {
        y -=
          (layerRect.top + layerRect.height - (areaRect.top + areaRect.height) - borderWidth) /
          scaleFactor
      }
    }

    if (type === 'text') {
      resizeText(id, fontSize, { x, y })
    } else {
      stretchLayer(id, newSize, { x, y })
    }
  }

  return layer ? (
    <div className='layer-actions'>
      <div className='single-action delete-action' onClick={() => deleteLayer(layer.id)}>
        <img src={iconDelete} alt='' />
      </div>
      <div
        className='single-action center-horizontal-action'
        onClick={() => centerLayer('horizontal')}>
        <img src={iconCenterH} alt='' />
      </div>
      <div className='single-action center-vertical-action' onClick={() => centerLayer('vertical')}>
        <img src={iconCenterV} alt='' />
      </div>
      <div className='single-action stretch-action' onClick={stretch}>
        <img src={iconStretch} alt='' />
      </div>
      <div
        className='single-action stretch-action'
        onClick={() => {
          if (layer.rotateAngle.degree !== 0) rotateLayer(layer.id, { degree: 0, radian: 0 })
        }}>
        <img src={iconZeroRotate} alt='' />
      </div>
    </div>
  ) : null
}

const mapStateToProps = state => ({
  zoom: state.views.filter(view => view.isActive)[0].zoom,
})

const mapDispatchToProps = dispatch => ({
  deleteLayer: id => dispatch(deleteLayer(id)),
  moveLayer: (id, coords) => dispatch(moveLayer(id, coords)),
  stretchLayer: (id, size, coords) => dispatch(stretchLayer(id, size, coords)),
  resizeText: (id, fontSize, coords) => dispatch(resizeText(id, fontSize, coords)),
  rotateLayer: (id, rotateAngle) => dispatch(rotateLayer(id, rotateAngle)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerActions)
