import * as ActionTypes from '../constants/constants'

const initialState = {
  chatbot: null
}

export function whatsAppChatbot(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_WHATSAPP_CHATBOT: {
      return Object.assign({}, state, {
        chatbot: action.data
      })
    }
    default: {
      return state
    }
  }
}