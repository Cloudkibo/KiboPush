import * as ActionTypes from '../constants/constants'

export function handleSocketEvent (data) {
  return {
    type: ActionTypes.SOCKET_EVENT,
    data
  }
}

export function clearSocketData () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA
  }
}

export function handleSocketEventSms (data) {
  return {
    type: ActionTypes.SOCKET_EVENT_SMS,
    data
  }
}

export function clearSocketDataSms () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA_SMS
  }
}
