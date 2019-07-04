export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = file => dispatch => {
  let reader = new FileReader()
  let img = document.createElement('img')
  let area = document.querySelector('.workspace__area')

  img.onload = () => {
    let newImageSize = resizeImageOnUpload(img, area)
    console.log('upload action')
    dispatch({
      type: UPLOAD_IMAGE,
      content: reader.result,
      // view: activeView,
      size: {
        width: newImageSize.width,
        height: newImageSize.height,
      },
      originalSize: {
        width: img.width,
        height: img.height,
      },
    })
  }
  reader.onloadend = ended => {
    img.src = ended.target.result
  }
  reader.readAsDataURL(file)
}

export const RESIZE_LAYER = 'RESIZE_LAYER'

export const resizeLayer = (id, newSize) => {
  console.log('resize action')
  return {
    type: RESIZE_LAYER,
    id: id,
    size: newSize,
  }
}

export const MOVE_LAYER = 'MOVE_LAYER'

export const moveLayer = (id, coords) => {
  console.log('move action')
  return {
    type: MOVE_LAYER,
    id: id,
    moveTo: {
      x: coords.x,
      y: coords.y,
    },
  }
}

export const SET_FOCUS = 'SET_FOCUS'

export const setFocus = id => {
  console.log('focus action')
  return {
    type: SET_FOCUS,
    id: id,
  }
}

function resizeImageOnUpload(image, area) {
  let newImageSize = {
    width: image.width,
    height: image.height,
  }
  if (area) {
    let areaSize = getComputedStyle(area)
    let areaWidth = parseFloat(areaSize.width, 10)
    let areaHeight = parseFloat(areaSize.height, 10)

    if (newImageSize.width > areaWidth) {
      newImageSize.width = areaWidth
      newImageSize.height = newImageSize.width / (image.width / image.height)
    }
    if (newImageSize.height > areaHeight) {
      newImageSize.width =
        (newImageSize.width / newImageSize.height) * areaHeight
      newImageSize.height = areaHeight
    }
  }
  return newImageSize
}
