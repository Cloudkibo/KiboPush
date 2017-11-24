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
