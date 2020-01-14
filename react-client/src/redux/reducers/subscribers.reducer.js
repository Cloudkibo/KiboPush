import * as ActionTypes from '../constants/constants'

export function subscribersInfo (state = {}, action) {
  console.log('subscribers reducer', action)
  switch (action.type) {
    case ActionTypes.LOAD_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        subscribers: action.data,
        locales: action.locale
      })
    case ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        subscribers: action.data,
        locales: action.locale
      })
    case ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST_NEW:
      return Object.assign({}, state, {
        subscribers: action.data,
        count: action.count
      })
    case ActionTypes.LOAD_LOCALES_LIST:
      return Object.assign({}, state, {
        locales: action.data
      })
    case ActionTypes.LOAD_SUBSCRIBERS_COUNT:
      return Object.assign({}, state, {
        subscribersCount: action.data.count
      })

    default:
      return state
  }
}
