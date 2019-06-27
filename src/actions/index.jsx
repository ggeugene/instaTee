export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = file => dispatch => {
  let reader = new FileReader()
  let img = document.createElement('img')
  let area = document.querySelector('.workspace__area')

  img.onload = () => {
    let newImageSize = resizeImageOnUpload(img, area)
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

export const resizeLayer = (layer, newSize) => {
  console.log('resize action')
  return {
    type: RESIZE_LAYER,
    id: layer.id,
    size: newSize,
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
      console.log(newImageSize.width + '    ' + newImageSize.height)
    }
  }
  return newImageSize
}
