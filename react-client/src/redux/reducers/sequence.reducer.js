import * as ActionTypes from '../constants/constants'

export function sequenceInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_ALL_SEQUENCE:
      return Object.assign({}, state, {
        sequences: action.sequence
      })
    case ActionTypes.SHOW_ALL_SEQUENCE_NEW:
      return Object.assign({}, state, {
        sequences: action.sequence,
        count: action.count
      })
    case ActionTypes.SHOW_SUBSCRIBER_SEQUENCE:
      return Object.assign({}, state, {
        subscriberSequences: action.subscriberSequences
      })

    case ActionTypes.SHOW_ALL_MESSAGES:
      return Object.assign({}, state, {
        messages: action.messages,
        createdSequence: ''
      })
    case ActionTypes.SHOW_CREATED_SEQUENCE:
      return Object.assign({}, state, {
        createdSequence: action.data,
        messages: []
      })
    default:
      return state
  }
}
