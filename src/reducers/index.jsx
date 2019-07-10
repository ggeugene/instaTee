import {
  UPLOAD_IMAGE,
  RESIZE_LAYER,
  MOVE_LAYER,
  SET_FOCUS,
  REMOVE_FOCUS,
  ROTATE_LAYER,
} from '../actions'
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
      console.log('reducer upload')
      return {
        ...state,
        layers: [...state.layers, LayerConstructor(action, 'image')],
      }
    case RESIZE_LAYER:
      console.log('reducer resize')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? { ...layer, size: action.size, coords: action.coords }
            : layer
        ),
      }
    case MOVE_LAYER:
      console.log('reducer move layer')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id ? { ...layer, coords: action.moveTo } : layer
        ),
      }
    case SET_FOCUS:
      console.log('reducer set focus')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? { ...layer, isFocused: true }
            : { ...layer, isFocused: false }
        ),
      }
    case REMOVE_FOCUS:
      console.log('reducer remove focus')
      return {
        ...state,
        layers: state.layers.map(layer => ({ ...layer, isFocused: false })),
      }
    case ROTATE_LAYER:
      console.log('reducer rotate layer')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? { ...layer, rotateAngle: action.rotateAngle }
            : layer
        ),
      }
    default:
      return state
  }
}

export default rootReducer
