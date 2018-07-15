/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'

// const initialState = {
//   workflows: []
// }

export function invitationsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_INVITATIONS:
      return Object.assign({}, state, {
        invitations: action.data
      })
    case ActionTypes.ADD_INVITATION:
      return Object.assign({}, state, {
        invitations: action.data
      })
    case ActionTypes.INVITATION_SUCCESS:
      return Object.assign({}, state, {
        successMessageEdit: action.successMessage
      })

    case ActionTypes.INVITATION_FAILURE:
      return Object.assign({}, state, {
        errorMessageEdit: action.errorMessage
      })

    case ActionTypes.CLEAR_INVITATION_ALERT_MESSAGES:
      return Object.assign({}, state, {
        successMessageEdit: '',
        errorMessageEdit: ''
      })

    default:
      return state
  }
}
