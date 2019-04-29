import * as ActionTypes from '../constants/constants'
const initialState = {
  errorMessage: null,
  successMessage: null,
  errorSignup: null,
  successSignup: null
}
export function signupInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.RESEND_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      })
    case ActionTypes.RESEND_SUCCESS:
      return Object.assign({}, state, {
        successMessage: action.successMessage
      })
    case ActionTypes.SIGNUP_FAILURE:
      return Object.assign({}, state, {
        errorSignup: action.errorMessage
      })
    case ActionTypes.SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        successSignup: action.successMessage
      })
    case ActionTypes.SKIP_SUCCESS:
      return Object.assign({}, state, {
        successSkip: action.successSkip
      })
    default:
      return state
  }
}
