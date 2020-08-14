import * as ActionTypes from '../constants/constants'

export function notificationsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: action.data
      })
      case ActionTypes.SHOW_TOASTR_NOTIFICATION:
      return Object.assign({}, state, {
        toastr_notification: action.data
      })
    default:
      return state
  }
}
