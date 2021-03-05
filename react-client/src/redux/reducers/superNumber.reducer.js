import * as ActionTypes from '../constants/constants'

export function superNumberInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_COMMERCE_TEMPLATES:
      return Object.assign({}, state, {
        templates: action.data
      })
      case ActionTypes.SAVE_SUPERNUMBER_PRFERENCES:
        return Object.assign({}, state, {
          superNumberPreferences: action.data
        })
    default:
      return state
  }
}
