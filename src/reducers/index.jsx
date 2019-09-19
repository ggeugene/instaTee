import {
  UPLOAD_IMAGE,
  ADD_IMAGE,
  RESIZE_LAYER,
  MOVE_LAYER,
  SET_FOCUS,
  REMOVE_FOCUS,
  ROTATE_LAYER,
  DELETE_LAYER,
  DELETE_UPLOADED,
  STRETCH_LAYER,
  SET_IMAGE_PROP,
  ADD_TEXT,
  RESIZE_TEXT,
  SET_TEXT_ALIGN,
  SET_TEXT_TYPE,
  SET_TEXT_CONTENT,
  SET_TEXT_COLOR,
  SET_STROKE_COLOR,
  TOGGLE_STROKE_COLOR,
  SET_TEXT_SIZE,
  SET_TEXT_FONT,
  SET_VISIBILITY,
  REORDER_STORE,
  CHANGE_VIEW,
  CHANGE_COLOR,
} from '../actions'
import { LayerConstructor } from '../components/LayerConstructor'
import { VIEWS as defaultViews } from '../constants'

const INITIAL_STATE = {
  layers: [],
  views: defaultViews,
  uploads: [],
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
                props: { ...layer.props, brightness: action.value },
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
                props: { ...layer.props, contrast: action.value },
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
                props: { ...layer.props, hue: action.value },
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
      console.log('reducer upload image')
      return {
        ...state,
        uploads: [...state.uploads, action],
      }
    case ADD_IMAGE:
      console.log('reducer add image')
      return {
        ...state,
        layers: [
          LayerConstructor(
            { ...action.imageObject, id: action.id, activeView: action.activeView },
            'image'
          ),
          ...state.layers,
        ],
      }
    case ADD_TEXT:
      console.log('reducer add text')
      return {
        ...state,
        layers: [LayerConstructor(action, 'text'), ...state.layers],
      }
    case RESIZE_TEXT:
      console.log('reducer resize text')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                coords: action.coords,
                size: { width: 'auto', height: 'auto' },
                props: { ...layer.props, fontSize: action.fontSize },
              }
            : layer
        ),
      }
    case SET_TEXT_ALIGN:
      console.log('reducer set text align')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: { ...layer.props, align: action.align },
              }
            : layer
        ),
      }
    case SET_TEXT_COLOR:
      console.log(`reducer set text color ${action.colorHex}`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: { ...layer.props, color: action.colorHex },
              }
            : layer
        ),
      }
    case SET_STROKE_COLOR:
      console.log(`reducer set stroke color ${action.colorHex}`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: {
                  ...layer.props,
                  colorStroke: { ...layer.props.colorStroke, color: action.colorHex },
                },
              }
            : layer
        ),
      }
    case TOGGLE_STROKE_COLOR:
      console.log(`reducer toggle stroke ${action.id}`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                props: {
                  ...layer.props,
                  colorStroke: { ...layer.props.colorStroke, active: action.active },
                },
              }
            : layer
        ),
      }
    case SET_TEXT_SIZE:
      console.log(`reducer set text size ${action.fontSize}`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                coords: action.coords,
                props: { ...layer.props, fontSize: action.fontSize },
              }
            : layer
        ),
      }
    case SET_TEXT_TYPE:
      console.log(`reducer set text type`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                coords: action.coords,
                props: { ...layer.props, style: action.types },
              }
            : layer
        ),
      }
    case SET_TEXT_CONTENT:
      console.log('reducer set text content')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? { ...layer, content: action.content, coords: action.coords }
            : layer
        ),
      }
    case SET_TEXT_FONT:
      console.log(`reducer set font family`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id
            ? {
                ...layer,
                coords: action.coords,
                props: { ...layer.props, fontFamily: action.fontFamily },
              }
            : layer
        ),
      }
    case RESIZE_LAYER:
      console.log('reducer resize')
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id ? { ...layer, size: action.size, coords: action.coords } : layer
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
          layer.id === action.id ? { ...layer, isFocused: true } : { ...layer, isFocused: false }
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
          layer.id === action.id ? { ...layer, rotateAngle: action.rotateAngle } : layer
        ),
      }
    case DELETE_LAYER:
      console.log(`reducer delete layer ${action.id}`)
      return {
        ...state,
        layers: state.layers.filter(layer => layer.id !== action.id),
      }
    case DELETE_UPLOADED:
      console.log(`reducer delete uploaded ${action.index}`)
      return {
        ...state,
        uploads: state.uploads.filter((layer, index) => index !== action.index),
      }
    case STRETCH_LAYER:
      console.log(`reducer stretch`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id ? { ...layer, size: action.size, coords: action.coords } : layer
        ),
      }
    case SET_VISIBILITY:
      console.log(`reducer set visibility`)
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.id ? { ...layer, hidden: action.hidden } : layer
        ),
      }
    case REORDER_STORE:
      console.log(`reducer reorder store`)
      let i = 0
      return {
        ...state,
        layers: state.layers
          .map(layer => {
            if (action.ids.includes(layer.id)) {
              i = action.ids.findIndex(elem => elem === layer.id)
              return { ...layer, zIndex: action.zIndexes[i] }
            } else {
              return layer
            }
          })
          .sort((a, b) => b.zIndex - a.zIndex),
      }
    case CHANGE_VIEW:
      console.log(`reducer change view`)
      return {
        ...state,
        views: state.views.map(view =>
          view.viewId === action.viewId ? { ...view, currentView: action.newView } : view
        ),
      }
    case CHANGE_COLOR:
      console.log(`reducer change color`)
      return {
        ...state,
        views: state.views.map(view =>
          view.viewId === action.viewId ? { ...view, currentColorId: action.colorId } : view
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
