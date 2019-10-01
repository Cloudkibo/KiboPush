import * as ActionTypes from '../constants/constants'
export function messengerCodeInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_IMAGE:
      return Object.assign({}, state, {
        image: action.data
      })
      case ActionTypes.RESET_STATE_MSG_CODE:
      return Object.assign({}, state, {
        messengerCode: {
          pageId: '',
          ref_parameter: '',
          reply: [{
            id: new Date().getTime(),
            text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
            componentType: 'text'
          }],
          sequenceId: ''
        }
      })
    default:
      return state
  }
}
