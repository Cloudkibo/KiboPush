import * as ActionTypes from '../constants/constants'

export function messageAlertsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_MESSAGE_ALERT_SOCKET_DATA:
      return Object.assign({}, state, {
        socketData: action.data
      })
    default:
      return state
  }
}
