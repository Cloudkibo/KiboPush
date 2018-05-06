import * as ActionTypes from '../constants/constants'

export function botsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_BOTS:
      return Object.assign({}, state, {
        bots: action.data
      })
    case ActionTypes.SHOW_CREATED_BOT:
      return Object.assign({}, state, {
        createdBot: action.data
      })
    case ActionTypes.SHOW_BOT_DETAILS:
      return Object.assign({}, state, {
        botDetails: action.data
      })
    case ActionTypes.APPLY_BOT_TEMPLATE:
      return Object.assign({}, state, {
        botTemplate: action.data
      })
    default:
      return state
  }
}
