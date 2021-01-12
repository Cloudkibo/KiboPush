import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { showAutomatedOptions } from './basicinfo.actions'

export function setSocketData (data) {
  return {
    type: ActionTypes.SET_MESSAGE_ALERT_SOCKET_DATA,
    data
  }
}

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

export function addSubscription(data, callback) {
  return (dispatch) => {
    callApi('messageAlerts/subscribe', 'post', data)
      .then(res => {
        callback(res)
      })
  }
}

export function removeSubscription(id, callback) {
  return (dispatch) => {
    callApi(`messageAlerts/unsubscribe/${id}`)
      .then(res => {
        callback(res)
      })
  }
}

export function setBusinessHours(data, automatedOptions, callback) {
  return (dispatch) => {
    callApi('company/setBusinessHours', 'post', data)
      .then(res => {
        callback(res)
        dispatch(showAutomatedOptions(automatedOptions))
      })
  }
}
