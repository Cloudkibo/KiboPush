import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function enable (API) {
  console.log('Enabling API')
  console.log(API)
  return (dispatch) => {
    callApi('api_settings/enable', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('enable', res.payload)
          dispatch(enableSuccess(res.payload))
        }
      })
  }
}
export function disable (API) {
  console.log('Disabling API')
  console.log(API.company_id)
  return (dispatch) => {
    callApi('api_settings/disable', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('disable', res.payload)
          dispatch(disableSuccess(res.payload))
        }
      })
  }
}
export function enableSuccess (data) {
  return {
    type: ActionTypes.ENABLE_SUCCESS,
    data
  }
}

export function disableSuccess (data) {
  return {
    type: ActionTypes.DISABLE_SUCCESS,
    data
  }
}
export function reset (API) {
  console.log('Disabling API')
  console.log(API.company_id)
  return (dispatch) => {
    callApi('api_settings/reset', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          dispatch(resetSuccess(res.payload))
        }
      })
  }
}
export function resetSuccess (data) {
  return {
    type: ActionTypes.RESET_SUCCESS,
    data
  }
}
export function getAPI (API) {
  console.log('fetching API credentials')
  console.log(API.company_id)
  return (dispatch) => {
    callApi('api_settings/', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          dispatch(getAPISuccess(res.payload))
        } else if (res.status === 'failed') {
          console.log('reset', res.description)
          dispatch(getAPIFailure(res.description))
        }
      })
  }
}
export function getAPISuccess (data) {
  return {
    type: ActionTypes.GET_API_SUCCESS,
    data
  }
}
export function getAPIFailure (data) {
  return {
    type: ActionTypes.GET_API_FAILURE,
    data
  }
}
export function saveSwitchState () {
  console.log('saveSwitchState called')
  return {
    type: ActionTypes.SAVE_SWITCH_STATE,
    data: 'changed'
  }
}
export function changePass (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('reset_password/change', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          msg.success('Password changed successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function showGreetingMessage (data) {
  console.log('Saving Greeting Message')
  return {
    type: ActionTypes.GET_GREETING_MESSAGE,
    data: data
  }
}

export function saveGreetingMessage (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('pages/saveGreetingText', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('success greeting text', res.payload)
          msg.success('Greeting message saved successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}
