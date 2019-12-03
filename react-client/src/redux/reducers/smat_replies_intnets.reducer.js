import * as ActionTypes from '../constants/constants'

export function botIntentsInfo (state = {}, action) {
    switch (action.type) {
        case ActionTypes.SHOW_BOT_INTENTS:
          return Object.assign({}, state, {
            botIntents: action.data,
          })
        default:
          return state
      }
}