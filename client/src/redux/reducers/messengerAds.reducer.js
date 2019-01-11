import * as ActionTypes from '../constants/constants'

const initialState = {
  messengerAd: {
    pageId: '',
    jsonAdId: '',
    jsonAdMessages: [{
      jsonAdMessageId: 1,
      title: 'Opt In Message',
      jsonAdMessageParentId: null,
      messageContent: [{
        id: new Date().getTime(),
        text: 'Welcome! Thank you for being interested in our product! The next post about it is coming soon, stay tuned!\nAre you interested in having a discount?',
        componentType: 'text',
        buttons: [{
          type: 'postback',
          title: 'Sure I do!',
          payload: 2
        }]
      }]
    },
    {
      jsonAdMessageId: 2,
      title: 'Sure I do',
      jsonAdMessageParentId: 1,
      messageContent: [{
        id: new Date().getTime() + 1,
        text: 'Great. We will contact you as soon as we have a deal for you!',
        componentType: 'text'
      }]
    }]
  }
}

export function messengerAdsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_MESSENGER_ADS:
      return Object.assign({}, state, {
        messengerAds: action.data
      })
    case ActionTypes.SAVE_CURRENT_JSON_AD:
      return Object.assign({}, state, {
        messengerAd: action.data
      })
    case ActionTypes.SET_DEFAULT_JSON_AD:
      return Object.assign({}, state, {
        messengerAd: initialState.messengerAd
      })
    default:
      return state
  }
}
