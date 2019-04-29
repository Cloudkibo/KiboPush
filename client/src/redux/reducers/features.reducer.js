import * as ActionTypes from '../constants/constants'

const initialState = {
  features: []
}

export function featuresInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_FEATURES:
      return Object.assign({}, state, {
        features: action.data
      })

    default:
      return state
  }
}
