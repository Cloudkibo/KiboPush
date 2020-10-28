import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function setMessageAlert(data) {
  return {
    type: ActionTypes.SHOW_MESSAGE_ALERT,
    data: data
  }
}

export function fetchNotifications (data, cb) {
  console.log('fetchNotifications')
  return (dispatch) => {
    callApi('notifications', 'post', data).then(res => {
      console.log('response from notifications', res)
      cb(res)
    })
  }
}

export function markRead (data, cb) {
  return (dispatch) => {
    callApi('notifications/markRead', 'post', data).then(res => {
      console.log('response from notifications', res)
      cb(res)
    })
  }
}
