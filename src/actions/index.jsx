export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = file => dispatch => {
  let reader = new FileReader()
  let img = document.createElement('img')

  img.onload = () => {
    dispatch({
      type: UPLOAD_IMAGE,
      imageUrl: reader.result,
      // view: activeView,
      dimensions: {
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
