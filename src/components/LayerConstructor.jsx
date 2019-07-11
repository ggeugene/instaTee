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
      width: options.size.width,
      height: options.size.height,
    },
    originalSize: {
      width: options.originalSize.width,
      height: options.originalSize.height,
    },
    rotateAngle: {
      degree: 0,
      radian: 0,
    },
  }
  if (type === 'image') {
    layer.content = options.content
    layer.props = {
      brightness: 0,
      contrast: 0,
      hue: 0,
    }
  }

  return layer
}
