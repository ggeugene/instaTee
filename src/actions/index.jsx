let nextLayerId = 0

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = file => dispatch => {
  let reader = new FileReader()
  let img = document.createElement('img')
  let area = document.querySelector('.workspace__area')
  img.onload = () => {
    let newImageSize = resizeImageOnUpload(img, area)
    console.log('action upload')
    dispatch({
      type: UPLOAD_IMAGE,
      content: reader.result,
      // view: activeView,
      id: nextLayerId++,
      fileName: file.name,
      size: {
        width: newImageSize.width,
        height: newImageSize.height,
      },
      originalSize: {
        width: img.width,
        height: img.height,
      },
    })
    dispatch(setFocus(nextLayerId - 1))
  }
  reader.onloadend = ended => {
    img.src = ended.target.result
  }
  reader.readAsDataURL(file)
}

export const ADD_TEXT = 'ADD_TEXT'

export const addText = () => dispatch => {
  console.log('action add text')
  // let span = document.createElement('span')
  // span.style.fontSize = '16px'
  // span.style.lineHeight = 1
  // span.style.visibility = 'visible'
  // span.style.fontFamily = 'sans-serif'
  // span.innerHTML = 'Input text'
  // document.body.appendChild(span)
  // const spanRect = span.getBoundingClientRect()
  // const width = spanRect.width
  // const height = spanRect.height
  // span.parentNode.removeChild(span)

  dispatch({
    type: ADD_TEXT,
    id: nextLayerId++,
    content: 'Input text',
    // size: { width, height },
  })
  dispatch(setFocus(nextLayerId - 1))
}

export const RESIZE_LAYER = 'RESIZE_LAYER'

export const resizeLayer = (id, newSize, newCoords) => {
  console.log('action resize')
  return {
    type: RESIZE_LAYER,
    id: id,
    size: newSize,
    coords: newCoords,
  }
}

export const RESIZE_TEXT = 'RESIZE_TEXT'

export const resizeText = (id, fontSize, newCoords) => {
  console.log('action resize text')
  return {
    type: RESIZE_TEXT,
    id: id,
    fontSize: fontSize,
    coords: newCoords,
  }
}

export const MOVE_LAYER = 'MOVE_LAYER'

export const moveLayer = (id, coords) => {
  console.log('action move')
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
  console.log(`action focus ${id}`)
  return {
    type: SET_FOCUS,
    id: id,
  }
}

export const REMOVE_FOCUS = 'REMOVE_FOCUS'

export const removeFocus = () => {
  console.log(`action remove focus`)
  return {
    type: REMOVE_FOCUS,
  }
}

export const ROTATE_LAYER = 'ROTATE_LAYER'

export const rotateLayer = (id, rotateAngle) => {
  console.log(`action rotate`)
  return {
    type: ROTATE_LAYER,
    id: id,
    rotateAngle: {
      degree: rotateAngle.degree,
      radian: rotateAngle.radian,
    },
  }
}

export const DELETE_LAYER = 'DELETE_LAYER'

export const deleteLayer = (id, fileName) => {
  console.log(`action delete`)
  let input = document.getElementById('file-upload')
  if (input.value.includes(fileName)) {
    input.value = ''
  }
  return {
    type: DELETE_LAYER,
    id: id,
  }
}

export const STRETCH_LAYER = 'STRETCH_LAYER'

export const stretchLayer = (id, size, coords) => {
  console.log(`action stretch`)
  return {
    type: STRETCH_LAYER,
    id: id,
    size,
    coords,
  }
}

export const SET_IMAGE_PROP = 'SET_IMAGE_PROP'

export const setImageProp = (id, value, prop) => {
  console.log(`action set image ${prop}`)
  return {
    type: SET_IMAGE_PROP,
    id: id,
    value,
    prop,
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
