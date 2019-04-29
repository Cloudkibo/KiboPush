import * as ActionTypes from '../constants/constants'

export function notificationsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: action.data
      })
    default:
      return state
  }
}
