import * as ActionTypes from '../constants/constants'

const initialState = {
    refreshRequired: false,
    refreshMessage: '',
    sponsoredMessages: [],
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
    },
    reconnectFbRequired: false
}

export function sponsoredMessagingInfo (state = initialState, action) {
    switch (action.type) {
      case ActionTypes.SHOW_SPONSORED_MESSAGES:
        return Object.assign({}, state, {
          sponsoredMessages: action.sponsoredMessages,
          reconnectFbRequired: action.reconnectFbRequired,
          count: action.count,
          refreshRequired: action.refreshRequired
        })
      case ActionTypes.ADD_TO_SPONSORED_MESSAGES:
        return Object.assign({}, state, {
          refreshMessage: action.message,
          refreshRequired: true
        })
      case ActionTypes.UPDATE_SPONSORED_MESSAGES_LIST_ITEM:
        return { 
          ...state, 
          sponsoredMessages: state.sponsoredMessages.map(
              (sponsoredMessage) => sponsoredMessage._id === action.sponsoredMessage._id ? {...sponsoredMessage, status: action.status}
                                      : sponsoredMessage
          )
       }
        case ActionTypes.CREATE_SPONSORED_MESSAGE:
          return Object.assign(state, {}, {
            sponsoredMessage: action.data
          })
        case ActionTypes.UPDATE_SPONSORED_MESSAGE:
        return Object.assign({}, state, {
          sponsoredMessage: {...action.data}
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
