/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'

const initialState = {
  messengerRefURL: {
    pageId: '',
    ref_parameter: '',
    reply: [{
      id: new Date().getTime(),
      text: 'Welcome! Thank you for subscribing. The next post is coming soon, stay tuned!\nP.S. If you ever want to unsubscribe just type "stop".',
      componentType: 'text'
    }],
    sequenceId: ''
  }
}

export function messengerRefURLInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_MESSENGER_REF_URLS:
      console.log('ActionTypes.SHOW_MESSENGER_REF_URLS', ActionTypes.SHOW_MESSENGER_REF_URLS)
      return Object.assign({}, state, {
        messengerRefURLs: action.data
      })
    case ActionTypes.UPDATE_MESSENGER_REF_URL:
      console.log('ActionTypes.UPDATE_MESSENGER_REF_URL', ActionTypes.UPDATE_MESSENGER_REF_URL)
      console.log('action.data', action.data)
      return Object.assign({}, state, {
        messengerRefURL: action.data
      })
    case ActionTypes.RESET_STATE_REF_URL:
      return Object.assign({}, state, {
        messengerRefURL: {
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
      console.log('default', action)
      return state
  }
}
