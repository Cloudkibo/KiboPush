import * as ActionTypes from '../constants/constants'

// const initialState = {
//   polls: []
// }

export function pollsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_ALL_POLL_RESPONSES:
      return Object.assign({}, state, {
        allResponses: action.data,
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.FETCH_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data,
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.FETCH_POLLS_LIST_NEW:
      return Object.assign({}, state, {
        polls: action.data,
        count: action.count,
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.ADD_POLL:
      return Object.assign({}, state, {
        pollCreated: action.data,
        warning: ''
      })
    case ActionTypes.ADD_POLL_RESPONSES:
      return Object.assign({}, state, {
        responses: action.sorted,
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.ADD_POLL_RESPONSES_FULL:
      return Object.assign({}, state, {
        responsesfull: action.data,
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.SEND_POLL_SUCCESS:
      return Object.assign({}, state, {
        successMessage: 'Poll sent successfully!',
        warning: '',
        pollCreated: ''
      })

    case ActionTypes.SEND_POLL_FAILURE:
      return Object.assign({}, state, {
        errorMessage: 'Poll sending failed!',
        warning: '',
        pollCreated: ''
      })

    case ActionTypes.CLEAR_ALERT:
      return Object.assign({}, state, {
        successMessage: '',
        errorMessage: '',
        warning: '',
        pollCreated: ''
      })
    case ActionTypes.POLLS_WARNING:
      return Object.assign({}, state, {
        warning: action.data,
        pollCreated: ''
      })

    default:
      return state
  }
}
