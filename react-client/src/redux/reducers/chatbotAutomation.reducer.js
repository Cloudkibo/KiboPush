import * as ActionTypes from '../constants/constants'

const initialState = {
  chatbots: null
}

export function chatbotAutomationInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHATBOT_AUTOMATION:
      return Object.assign({}, state, {
        chatbots: action.data
      })

    default:
      return state
  }
}
