import * as ActionTypes from '../constants/constants'

// const initialState = {
//   workflows: []
// }

export function workflowsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_WORKFLOW_LIST:
      return Object.assign({}, state, {
        workflows: action.data
      })
    case ActionTypes.ADD_WORKFLOW:
      return Object.assign({}, state, {
        workflows: [...state.workflows, action.data]
      })
    case ActionTypes.WORKFLOW_SUCCESS:
      return Object.assign({}, state, {
        successMessageEdit: action.successMessage
      })

    case ActionTypes.EDIT_WORKFLOW_FAILURE:
      return Object.assign({}, state, {
        errorMessageEdit: action.errorMessage
      })

    case ActionTypes.CLEAR_WORKFLOW_ALERT_MESSAGES:
      return Object.assign({}, state, {
        successMessageEdit: '',
        errorMessageEdit: ''
      })

    default:
      return state
  }
}
