import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showNotifications (data) {
  return {
    type: ActionTypes.SHOW_NOTIFICATIONS,
    data
  }
}

export function fetchNotifications () {
  console.log('fetchNotifications')
  return (dispatch) => {
    callApi('notifications').then(res => {
      console.log('response from notifications', res)
      if (res.status === 'success') {
        dispatch(showNotifications(res.payload.notifications))
      }
    })
  }
}

export function markRead (data) {
  return (dispatch) => {
    callApi('notifications/markRead', 'post', data).then(res => {
      console.log('response from notifications', res)
      if (res.status === 'success') {
        dispatch(fetchNotifications())
      }
    })
  }
}
