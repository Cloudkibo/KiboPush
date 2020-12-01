import * as ActionTypes from '../constants/constants'

export function messengerComponentsInfo (state = {}, action) {
  switch (action.type) {
      case ActionTypes.SHOW_MESSENGER_COMPONENTS:
        return Object.assign({}, state, {
          messengerComponents: action.data
      })
    default:
      return state
  }
}
