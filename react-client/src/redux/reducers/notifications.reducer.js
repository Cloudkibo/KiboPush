import * as ActionTypes from '../constants/constants'

export function notificationsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: action.data
      })
      case ActionTypes.SHOW_MESSAGE_ALERT:
        return Object.assign({}, state, {
          message_alert: action.data
      })
    default:
      return state
  }
}
