let nextLayerId = 0

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = file => dispatch => {
  let reader = new FileReader()
  let img = document.createElement('img')
  let area = document.querySelector('.workspace__area')
  img.onload = () => {
    const newImageSize = resizeImageOnUpload(img, area)
    console.log('action upload')
    dispatch({
      type: UPLOAD_IMAGE,
      content: reader.result,
      fileName: file.name,
      size: {
        width: newImageSize.width > img.width ? img.width : newImageSize.width,
        height: newImageSize.height > img.height ? img.height : newImageSize.height,
      },
      originalSize: {
        width: img.width,
        height: img.height,
      },
    })
    let input = document.getElementById('file-upload')
    input.value = ''
  }
  reader.onloadend = ended => {
    img.src = ended.target.result
  }
  reader.readAsDataURL(file)
}

export const ADD_IMAGE = 'ADD_IMAGE'

export const addImage = (activeView, imageObject, uploadedIndex) => dispatch => {
  console.log('action add image')
  let area = document.querySelector('.workspace__area')
  dispatch({
    type: ADD_IMAGE,
    id: nextLayerId++,
    uploadedIndex,
    imageObject,
    activeView,
  })
  dispatch(setFocus(nextLayerId - 1))
  const newCoords = getCenterCoords(imageObject.size, area)
  dispatch(moveLayer(nextLayerId - 1, newCoords))
}

export const ADD_TEXT = 'ADD_TEXT'

export const addText = activeView => dispatch => {
  console.log('action add text')

  dispatch({
    type: ADD_TEXT,
    id: nextLayerId++,
    content: '',
    activeView,
  })
  dispatch(setFocus(nextLayerId - 1))
  return Promise.resolve(nextLayerId - 1)
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

export const setFocus = id => dispatch => {
  console.log(`action focus ${id}`)
  dispatch({
    type: SET_FOCUS,
    id: id,
  })
}

export const REMOVE_FOCUS = 'REMOVE_FOCUS'

export const removeFocus = () => dispatch => {
  console.log(`action remove focus`)
  dispatch({
    type: REMOVE_FOCUS,
  })
  return Promise.resolve()
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

export const deleteLayer = id => {
  console.log(`action delete`)
  return {
    type: DELETE_LAYER,
    id: id,
  }
}

export const DELETE_UPLOADED = 'DELETE_UPLOADED'

export const deleteUploaded = index => {
  console.log(`action delete uploaded`)
  return {
    type: DELETE_UPLOADED,
    index,
  }
}

export const STRETCH_LAYER = 'STRETCH_LAYER'

export const stretchLayer = (id, size, coords) => {
  console.log(`action stretch image`)
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

export const SET_TEXT_ALIGN = 'SET_TEXT_ALIGN'

export const setTextAlign = (id, align) => {
  console.log(`action set text align ${align}`)
  return {
    type: SET_TEXT_ALIGN,
    id: id,
    align,
  }
}

export const SET_TEXT_TYPE = 'SET_TEXT_TYPE'

export const setTextType = (id, types, coords) => {
  console.log(`action set text types`)
  return {
    type: SET_TEXT_TYPE,
    id: id,
    types,
    coords,
  }
}

export const SET_TEXT_CONTENT = 'SET_TEXT_CONTENT'

export const setTextContent = (id, content, coords) => {
  console.log(`action set text content`)
  return {
    type: SET_TEXT_CONTENT,
    id: id,
    content,
    coords,
  }
}

export const SET_TEXT_COLOR = 'SET_TEXT_COLOR'

export const setTextColor = (id, colorHex) => {
  console.log(`action set text color`)
  return {
    type: SET_TEXT_COLOR,
    id: id,
    colorHex,
  }
}
export const SET_STROKE_COLOR = 'SET_STROKE_COLOR'

export const setStrokeColor = (id, colorHex) => {
  console.log(`action set stroke color`)
  return {
    type: SET_STROKE_COLOR,
    id: id,
    colorHex,
  }
}

export const TOGGLE_STROKE_COLOR = 'TOGGLE_STROKE_COLOR'

export const toggleStrokeColor = (id, active) => {
  console.log(`action toggle stroke`)
  return {
    type: TOGGLE_STROKE_COLOR,
    id: id,
    active,
  }
}

export const SET_TEXT_SIZE = 'SET_TEXT_SIZE'

export const setTextSize = (id, fontSize, coords) => {
  console.log(`action set text size`)
  return {
    type: SET_TEXT_SIZE,
    id: id,
    fontSize,
    coords,
  }
}

export const SET_TEXT_FONT = 'SET_TEXT_FONT'

export const setTextFont = (id, fontFamily, coords) => {
  console.log(`action set font family`)
  return {
    type: SET_TEXT_FONT,
    id: id,
    fontFamily,
    coords,
  }
}

export const SET_VISIBILITY = 'SET_VISIBILITY'

export const setVisibility = (id, hidden) => {
  console.log(`action set visibility`)
  return {
    type: SET_VISIBILITY,
    id: id,
    hidden,
  }
}

export const REORDER_STORE = 'REORDER_STORE'

export const reorderStore = (ids, zIndexes) => {
  console.log(`action reorder store`)
  return {
    type: REORDER_STORE,
    ids,
    zIndexes,
  }
}

export const CHANGE_VIEW = 'CHANGE_VIEW'

export const changeView = (newView, viewId) => {
  console.log(`action change view`)
  return {
    type: CHANGE_VIEW,
    newView,
    viewId,
  }
}

export const CHANGE_VIEW_TYPE = 'CHANGE_VIEW_TYPE'

export const changeViewType = viewId => {
  console.log(`action change view`)
  return {
    type: CHANGE_VIEW_TYPE,
    viewId,
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
      newImageSize.width = (newImageSize.width / newImageSize.height) * areaHeight
      newImageSize.height = areaHeight
    }
  }
  return newImageSize
}

function getCenterCoords(size, area) {
  const areaRect = area.getBoundingClientRect()
  const borderWidth = 1

  const areaCenter = {
    x: (areaRect.width - borderWidth * 2) / 2,
    y: (areaRect.height - borderWidth * 2) / 2,
  }

  const newCoords = {
    x: areaCenter.x - size.width / 2,
    y: areaCenter.y - size.height / 2,
  }

  return newCoords
}
