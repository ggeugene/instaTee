import { UPLOAD_IMAGE } from '../actions'
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
      // let newState = { ...state }
      // newState[action.view].layers.push(LayerConstructor(action, 'image'))
      // return newState
      return {
        ...state,
        layers: [...state.layers, LayerConstructor(action, 'image')],
      }
    default:
      return state
  }
}

export default rootReducer
