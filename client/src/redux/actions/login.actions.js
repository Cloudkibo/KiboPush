import * as ActionTypes from '../constants/constants'
import fetch from 'isomorphic-fetch'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function Failure (message) {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    errorMessage: message
  }
}
export function Success () {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    successMessage: 'success'
  }
}
export function logIn (data) {
  let headers1 = {
    'content-type': 'application/json'
  }
  console.log('data', data)
  return (dispatch) => {
    fetch(`/auth/local`, {
      method: 'post',
      body: JSON.stringify(data),
      // eslint-disable-next-line no-undef
      headers: headers1
    }).then((res) => res.json()).then((res) => res).then((res) => {
      console.log('res', res)
      if (res.token) {
        auth.putCookie(res.token)
        dispatch(Success())
      } else {
        dispatch(Failure(res.description))
      }
    })
  }
}

export function forgotFailure (message) {
  return {
    type: ActionTypes.FORGOT_FAILURE,
    errorMessage: message
  }
}
export function forgotSuccess () {
  return {
    type: ActionTypes.FORGOT_SUCCESS,
    successMessage: 'success'
  }
}
export function forgotPass (data, msg) {
  console.log('data', data)
  return (dispatch) => {
    callApi('reset_password/forgot', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          msg.success('A password reset link has been sent to your email.')
          dispatch(forgotSuccess())
        } else {
          msg.error(res.description)
          dispatch(forgotFailure(res.description))
        }
      })
  }
}
