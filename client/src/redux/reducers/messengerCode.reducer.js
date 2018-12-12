import * as ActionTypes from '../constants/constants'
export function messengerCodeInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_IMAGE:
      return Object.assign({}, state, {
        image: action.data
      })
    default:
      return state
  }
}
