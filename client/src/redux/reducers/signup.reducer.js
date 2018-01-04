import * as ActionTypes from '../constants/constants'
const initialState = {
  errorMessage: null,
  successMessage: null
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
    default:
      return state
  }
}
