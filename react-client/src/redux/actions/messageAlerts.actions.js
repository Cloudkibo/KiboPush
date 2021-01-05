// import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchMessageAlerts(platform, callback) {
  return (dispatch) => {
    callApi('messageAlerts', 'post', {platform})
      .then(res => {
        callback(res)
      })
  }
}

export function fetchAlertSubscriptions(platform, callback) {
  return (dispatch) => {
    callApi('messageAlerts/subscriptions', 'post', {platform})
      .then(res => {
        callback(res)
      })
  }
}

export function saveAlert(alert, callback) {
  return (dispatch) => {
    callApi('messageAlerts/saveAlert', 'post', alert)
      .then(res => {
        callback(res)
      })
  }
}
