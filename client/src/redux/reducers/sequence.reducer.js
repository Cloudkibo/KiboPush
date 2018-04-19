import * as ActionTypes from '../constants/constants'

export function sequenceInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_ALL_SEQUENCE:
      return Object.assign({}, state, {
        sequences: action.sequence
      })

    case ActionTypes.SHOW_ALL_MESSAGES:
      return Object.assign({}, state, {
        messages: action.messages
      })
    default:
      return state
  }
}
