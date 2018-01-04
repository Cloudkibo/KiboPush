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
        } else {
          dispatch(Failure())
        }
      })
  }
}
