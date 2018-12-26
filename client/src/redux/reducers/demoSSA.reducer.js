import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: []
}

export function demoSSAInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DEMOSSA_CHAT:
      let tempChat = state.chat.concat(action.data)
      return Object.assign({}, state, {
        chat: tempChat
      })

    default:
      return state
  }
}
