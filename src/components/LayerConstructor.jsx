let nextLayerId = 0
let zIndex = 1
export function LayerConstructor({ ...options }, type) {
  let layer = {
    id: nextLayerId++,
    focused: false,
    type: type,
    zIndex: zIndex++,
    coords: {
      x: 0,
      y: 0,
    },
    dimensions: {
      width: options.dimensions.width,
      height: options.dimensions.height,
    },
    rotateAngle: 0,
  }
  if (type === 'image') {
    layer.content = options.imageUrl
    layer.props = {
      brightness: 0,
      contrast: 0,
      hue: 0,
    }
  }

  return layer
}
