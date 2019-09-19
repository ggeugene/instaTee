import blackShirtFront from './img/tshirt/black/black-front.png'
import blackShirtBack from './img/tshirt/black/black-back.png'
import whiteShirtFront from './img/tshirt/white/white-front.png'
import whiteShirtBack from './img/tshirt/white/white-back.png'

export const ItemTypes = {
  EDITOR_LAYER_ITEM: 'layer',
}
export const MAX_FONT_SIZE = 300

export const MIN_FONT_SIZE = 6

export const VIEWS = [
  {
    viewId: 0,
    categoryId: 0, // 0 - Men's, 1 - Women's, 2 - Children's, 3 - Accessories
    isActive: true,
    currentView: 'front',
    currentColorId: 0,
    colors: [
      {
        colorId: 0,
        front: blackShirtFront,
        back: blackShirtBack,
        hex: '#000000',
      },
      {
        colorId: 1,
        front: whiteShirtFront,
        back: whiteShirtBack,
        hex: '#ffffff',
      },
    ],
    styles: {
      top: '20%',
      left: '35%',
      right: '35%',
      bottom: '10%',
    },
  },
]
