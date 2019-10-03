import * as ActionTypes from '../constants/constants'

const initialState = {
  messengerCode: {
    pageId: '',
    optInMessage: [{
      id: new Date().getTime(),
      text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
      componentType: 'text'
    }],
    QRCode: ''
  }
}

export function messengerCodeInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_MESSENGER_CODE:
      return Object.assign({}, state, {
        messengerCode: action.data
      })
      case ActionTypes.RESET_STATE_MSG_CODE:
      return Object.assign({}, state, {
        messengerCode: {
          pageId: '',
          optInMessage: [{
            id: new Date().getTime(),
            text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
            componentType: 'text'
          }],
          QRCode: ''
        }
      })
      case ActionTypes.SHOW_MESSENGER_CODES:
          return Object.assign({}, state, {
            messengerCodes: action.data
          })
    default:
      return state
  }
}
