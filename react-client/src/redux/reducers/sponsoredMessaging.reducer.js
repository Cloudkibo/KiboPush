import * as ActionTypes from '../constants/constants'

const initialState = {
    sponsoredMessage :{
      _id: '',
      adAccountId: '',
      pageId: '',
      statsFromUs: '',
      status: 'Draft',
      campaignId: '',
      messageCreativeId: '',
      adSetId: '',
      adId: '',
      payload: [],
      adName: '',
      campaignName: '',
      campaignType: '',
      adSetName: '',
      adSetType: '',
      targeting: {
        gender: '',
        minAge: '',
        maxAge: ''
      },
      budgetType: '',
      budgetAmount: '',
      bidAmount: '',
      currency: ''
    }
}

export function sponsoredMessagingInfo (state = initialState, action) {
    switch (action.type) {
      case ActionTypes.SHOW_SPONSORED_MESSAGES:
        return Object.assign({}, state, {
          sponsoredMessages: action.sponsoredMessages,
          count: action.count
        })
        case ActionTypes.CREATE_SPONSORED_MESSAGE:
          return Object.assign({}, state, {
            sponsoredMessage: action.data
          })
        case ActionTypes.UPDATE_SPONSORED_MESSAGE:
        return Object.assign({}, state, {
          sponsoredMessage: action.data
        })
        case ActionTypes.SHOW_AD_ACCOUNTS:
          return Object.assign({}, state, {
            adAccounts: action.data
        })
        case ActionTypes.SHOW_CAMPAIGNS:
          return Object.assign({}, state, {
            campaigns: action.data
        })
        case ActionTypes.SHOW_AD_SETS:
          return Object.assign({}, state, {
            adSets: action.data
        })
        case ActionTypes.GET_INSIGHTS:
          return Object.assign({}, state, {
            insights: action.data
        })
      default:
        return state
    }
  }
