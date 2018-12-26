import * as ActionTypes from '../constants/constants'

export function messengerAdsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_MESSENGER_ADS:
      return Object.assign({}, state, {
        messengerAds: action.data
      })
    default:
      return state
  }
}
