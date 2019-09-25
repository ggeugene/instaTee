import blackShirtFront from './img/tshirt/black/black-front.png'
import blackShirtBack from './img/tshirt/black/black-back.png'
import whiteShirtFront from './img/tshirt/white/white-front.png'
import whiteShirtBack from './img/tshirt/white/white-back.png'
import cardWhite from './img/business-card/card-white.png'
import cardCategory from './img/business-card/card-category.png'

export const ItemTypes = {
  EDITOR_LAYER_ITEM: 'layer',
}
export const MAX_FONT_SIZE = 300

export const MIN_FONT_SIZE = 6

export const VIEWS = [
  {
    viewId: 0,
    categoryId: 0, // 0 - Men's, 1 - Women's, 2 - Children's, 3 - Accessories
    categorySrc: blackShirtFront, // image for category list
    isActive: true,
    currentView: 'front',
    currentColorId: 0,
    colors: [
      {
        colorId: 0,
        front: blackShirtFront, // front view image for specific color
        back: blackShirtBack, // back view image for specific color
        hex: '#000000',
        isLight: false, // determine white or black default color for text layer
      },
      {
        colorId: 1,
        front: whiteShirtFront,
        back: whiteShirtBack,
        hex: '#ffffff',
        isLight: true,
      },
    ],
    styles: {
      // workspace position relative to view
      top: '20%',
      left: '35%',
      right: '35%',
      bottom: '10%',
    },
    zoom: false,
  },
  {
    viewId: 1,
    categoryId: 3,
    categorySrc: cardCategory,
    isActive: false,
    currentView: 'front',
    currentColorId: 0,
    colors: [
      {
        colorId: 0,
        front: cardWhite,
        back: cardWhite,
        hex: '#ffffff',
        isLight: true,
      },
    ],
    styles: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '20%',
    },
    zoom: false,
  },
]
