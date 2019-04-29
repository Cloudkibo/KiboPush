/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'

// const initialState = {
//   workflows: []
// }

export function membersInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_MEMBERS:
      return Object.assign({}, state, {
        members: action.data
      })
    case ActionTypes.MEMBERS_SUCCESS:
      return Object.assign({}, state, {
        successMessageEdit: action.successMessage
      })

    case ActionTypes.MEMBERS_FAILURE:
      return Object.assign({}, state, {
        errorMessageEdit: action.errorMessage
      })

    case ActionTypes.CLEAR_MEMBERS_ALERT_MESSAGES:
      return Object.assign({}, state, {
        successMessageEdit: '',
        errorMessageEdit: ''
      })

    default:
      return state
  }
}
