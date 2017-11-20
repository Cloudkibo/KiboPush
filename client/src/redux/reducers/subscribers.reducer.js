import * as ActionTypes from '../constants/constants'

export function subscribersInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        subscribers: action.data,
        locales: action.locale
      })

    default:
      return state
  }
}
