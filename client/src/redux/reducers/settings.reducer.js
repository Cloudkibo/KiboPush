import * as ActionTypes from '../constants/constants'

export function APIInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.ENABLE_SUCCESS:
      return Object.assign({}, state, {
        apiEnable: action.data
      })
    case ActionTypes.DISABLE_SUCCESS:
      return Object.assign({}, state, {
        apiDisable: action.data
      })
    case ActionTypes.RESET_SUCCESS:
      return Object.assign({}, state, {
        resetData: action.data
      })
    case ActionTypes.GET_API_SUCCESS:
      return Object.assign({}, state, {
        apiSuccess: action.data
      })
    case ActionTypes.GET_API_FAILURE:
      return Object.assign({}, state, {
        apiFailure: action.data
      })
    case ActionTypes.SAVE_SWITCH_STATE:
      return Object.assign({}, state, {
        switchState: action.data
      })
    default:
      return state
  }
}
