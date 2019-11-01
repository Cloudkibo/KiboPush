import * as ActionTypes from '../constants/constants'

export function messengerAdsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_MESSENGER_ADS:
      return Object.assign({}, state, {
        messengerAds: action.data
      })
    case ActionTypes.SAVE_CURRENT_JSON_AD:
      return Object.assign({}, state, {
        messengerAd: action.data
      })
    case ActionTypes.CLEAR_MESSENGER_AD:
      return Object.assign({}, state, {
        messengerAd: action.data,
        jsonCode: action.data
      })
    case ActionTypes.SET_DEFAULT_JSON_AD:
      return Object.assign({}, state, {
        messengerAd: action.data
      })
    case ActionTypes.SHOW_JSON_CODE:
      return Object.assign({}, state, {
        jsonCode: action.data
      })
    default:
      return state
  }
}
