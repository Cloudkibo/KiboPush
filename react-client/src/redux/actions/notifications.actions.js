import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showNotifications (data) {
  var sorted = data.sort(function (a, b) {
    return new Date(b.datetime) - new Date(a.datetime)
  })
  return {
    type: ActionTypes.SHOW_NOTIFICATIONS,
    data: sorted
  }
}

export function setNotification (data) {
  return {
    type: ActionTypes.SHOW_TOASTR_NOTIFICATION,
    data: data
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
