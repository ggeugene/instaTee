import {
  UPLOAD_IMAGE,
  RESIZE_LAYER,
  MOVE_LAYER,
  SET_FOCUS,
  REMOVE_FOCUS,
  ROTATE_LAYER,
  DELETE_LAYER,
  // SET_INTERSECTION,
  STRETCH_LAYER,
  SET_IMAGE_PROP,
  ADD_TEXT,
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
  dragIntersect: true,
}

const setImageProps = (state, action) => {
  switch (action.prop) {
    case 'brightness':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: Object.assign(layer.props, {
                  brightness: action.value,
                }),
              }
            : layer
        ),
      }
    case 'contrast':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: Object.assign(layer.props, {
                  contrast: action.value,
                }),
              }
            : layer
        ),
      }
    case 'hue':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: Object.assign(layer.props, {
                  hue: action.value,
                }),
              }
            : layer
        ),
      }
    default:
      return { state }
  }
}

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE:
      console.log('reducer upload')
      return {
        ...state,
        layers: [...state.layers, LayerConstructor(action, 'image')],
      }
    case ADD_TEXT:
      console.log('reducer add text')
      return {
        ...state,
        layers: [...state.layers, LayerConstructor(action, 'text')],
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
    case DELETE_LAYER:
      console.log(`reducer delete layer ${action.id}`)
      return {
        ...state,
        layers: state.layers.filter(layer => layer.id !== action.id),
      }
    // case SET_INTERSECTION:
    //   console.log(`reducer set intersection`)
    //   return {
    //     ...state,
    //     dragIntersect: action.value,
    //   }
    case STRETCH_LAYER:
      console.log(`reducer stretch`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? { ...layer, size: action.size, coords: action.coords }
            : layer
        ),
      }
    case SET_IMAGE_PROP:
      console.log(`reducer set image ${action.prop}`)
      return setImageProps(state, action)
    default:
      return state
  }
}

export default rootReducer
