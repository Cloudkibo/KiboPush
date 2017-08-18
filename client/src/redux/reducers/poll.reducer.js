import * as ActionTypes from '../constants/constants'

// const initialState = {
//   polls: []
// }

export function pollsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data
      })
    case ActionTypes.ADD_POLL:
      return Object.assign({}, state, {
        polls: [...state.polls, action.data]
      })
    case ActionTypes.ADD_POLL_RESPONSES:
      return Object.assign({}, state, {
        responses: action.sorted
      })

    case ActionTypes.SEND_POLL_SUCCESS:
      return Object.assign({}, state, {
        successMessage: 'Poll sent successfully!'
      })

    case ActionTypes.SEND_POLL_FAILURE:
      return Object.assign({}, state, {
        errorMessage: 'Poll sending failed!'
      })

    case ActionTypes.CLEAR_ALERT:
      return Object.assign({}, state, {
        successMessage: '',
        errorMessage: ''
      })

    default:
      return state
  }
}
