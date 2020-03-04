import * as ActionTypes from '../constants/constants'

export function customFieldInfo (state = {}, action) {
  console.log('customField reducer', action)
  switch (action.type) {
    case ActionTypes.LOAD_CUSTOM_FIELDS:
      return Object.assign({}, state, {
        customFields: action.data
      })
      case ActionTypes.GET_CUSTOM_FIELD_SUBSCRIBER:
        return Object.assign({}, state, {
          customFieldSubscriber: action.data
        })
      case ActionTypes.CLEAR_CUSTOM_FIELD_VALUES:
        return Object.assign({}, state, {
          customFieldSubscriber: undefined
        })
    default:
      return state
  }
}
