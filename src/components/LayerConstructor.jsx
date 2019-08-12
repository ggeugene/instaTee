// let nextLayerId = 0
let zIndex = 1
export function LayerConstructor({ ...options }, type) {
  let layer = {
    // id: nextLayerId++,
    id: options.id,
    isFocused: false,
    type: type,
    zIndex: zIndex++,
    coords: {
      x: 0,
      y: 0,
    },
    size: {
      width: options.size ? options.size.width : 100,
      height: options.size ? options.size.height : 25,
    },
    originalSize: {
      width: options.size ? options.size.width : 100,
      height: options.size ? options.size.height : 25,
    },
    rotateAngle: {
      degree: 0,
      radian: 0,
    },
    content: options.content,
  }
  if (type === 'image') {
    layer.props = {
      brightness: 1,
      contrast: 100,
      hue: 0,
    }
    layer.fileName = options.fileName
  } else {
    layer.props = {
      align: 'left',
      bendAngle: 0,
      color: '#ffffff',
      colorStroke: 0,
      fontSize: 16,
      fontFamily: 'sans-serif',
      style: {
        bold: false,
        italic: false,
        regular: true,
        underline: false,
      },
    }
  }

  return layer
}
