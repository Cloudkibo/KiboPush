/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'

export function messengerRefURLInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_MESSENGER_REF_URLS:
      return Object.assign({}, state, {
        messengerRefURLs: action.data
      })
    default:
      return state
  }
}
