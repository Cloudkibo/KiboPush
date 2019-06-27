import * as ActionTypes from '../constants/constants'

export function customFieldInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_CUSTOM_FIELDS:
      return Object.assign({}, state, {
        customFields: action.data
      })
      case ActionTypes.GET_CUSTOM_FIELD_SUBSCRIBER:
        return Object.assign({}, state, {
          customFieldSubscriber: action.data
        })
    default:
      return state
  }
}
