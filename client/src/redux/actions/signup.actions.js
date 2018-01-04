import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'
export function Success () {
  return {
    type: ActionTypes.SIGNUP_SUCCESS,
    successMessage: 'success'
  }
}

export function Failure (message) {
  return {
    type: ActionTypes.SIGNUP_FAILURE,
    errorMessage: 'error'
  }
}

export function signUp (data) {
  console.log('data', data)
  return (dispatch) => {
    callApi('users/signup', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          auth.putCookie(res.token)
          dispatch(Success())
        } else {
          dispatch(Failure())
        }
      })
  }
}
export function resendSuccess (msg) {
  return {
    type: ActionTypes.RESEND_SUCCESS,
    successMessage: msg
  }
}

export function resendFailure () {
  return {
    type: ActionTypes.RESEND_FAILURE,
    errorMessage: 'error'
  }
}
export function resendEmail () {
  return (dispatch) => {
    callApi('email_verification/resend')
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          dispatch(resendSuccess(res.description))
        } else {
          dispatch(resendFailure())
        }
      })
  }
}
