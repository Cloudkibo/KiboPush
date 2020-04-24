import * as ActionTypes from '../constants/constants'

const initialState = {
  chatbots: []
}

export function chatbotsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHATBOTS:
      return Object.assign({}, state, {
        chatbots: action.data
      })

    default:
      return state
  }
}
