import { UPLOAD_IMAGE } from '../actions'
import { RESIZE_LAYER } from '../actions'
import { LayerConstructor } from '../components/LayerConstructor'

const INITIAL_STATE = {
  // workspace: {
  //   activeView: 'frontView',
  //   zoom: 0,
  //   fullscreen: false,
  //   tshirt: {
  //     type: 'regular',
  //     gender: 'male',
  //     color: 'black',
  //   },
  // },
  // frontView: {
  //   isActive: true,
  //   layers: [],
  // },
  // backView: {
  //   isActive: false,
  //   layers: [],
  // },
  layers: [],
}

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE:
      return {
        ...state,
        layers: [...state.layers, LayerConstructor(action, 'image')],
      }
    case RESIZE_LAYER:
      console.log('resize')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id ? { ...layer, size: action.size } : layer
        ),
      }
    default:
      return state
  }
}

export default rootReducer
