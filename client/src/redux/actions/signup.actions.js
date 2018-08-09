import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import {showuserdetails} from './basicinfo.actions'
import auth from '../../utility/auth.service'
export const API_URL = '/api'
export function Success () {
  return {
    type: ActionTypes.SIGNUP_SUCCESS,
    successMessage: 'success'
  }
}
export function skipSuccess () {
  return {
    type: ActionTypes.SKIP_SUCCESS,
    successSkip: 'success'
  }
}
export function Failure (message) {
  return {
    type: ActionTypes.SIGNUP_FAILURE,
    errorMessage: message
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

export function signUp (data, msg) {
  return (dispatch) => {
    callApi('users/signup', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          auth.putCookie(res.token)
          auth.putUserId(res.userid)
          dispatch(Success())
        } else {
          msg.error(res.description)
          dispatch(Failure(res.description))
        }
      })
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

export function skip () {
  return (dispatch) => {
    callApi('users/updateSkipConnect')
      .then(res => {
        console.log('res', res)
        if (res.status === 'success') {
          callApi('users')
            .then(res1 => {
              if (res1.status === 'success') {
                dispatch(showuserdetails(res1.payload))
                dispatch(skipSuccess())
              }
            })
        }
      })
  }
}
