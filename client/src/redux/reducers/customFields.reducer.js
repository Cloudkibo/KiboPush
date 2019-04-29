import * as ActionTypes from '../constants/constants'

export function customFieldInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_CUSTOM_FIELDS:
      return Object.assign({}, state, {
        customFields: action.data
      })
    default:
      return state
  }
}
