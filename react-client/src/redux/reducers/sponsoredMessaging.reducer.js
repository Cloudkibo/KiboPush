import * as ActionTypes from '../constants/constants'

const initialState = {
    sponsoredMessage :{
        _id: '',
        companyId: '',
        userId: '',
        ad_id: '',
        pageId: '',
        statsFromUs: '',
        status: 'Draft',
        campaign_id: '',
        campaign_name: '',
        message_creative_id: '',
        ad_account_id: '',
        ad_set_payload: {
            adset_name: '',
            adset_id: '',
            min_age:'',
            max_age:'',
            gender:'',
            budget: {},
            bidAmount: 0
        },
        ad_name: '',
        payload: []
    }
}

export function sponsoredMessagingInfo (state = initialState, action) {
    switch (action.type) {
      case ActionTypes.SHOW_SPONSORED_MESSAGES:
        return Object.assign({}, state, {
          sponsoredMessages: action.data
        })
        case ActionTypes.CREATE_SPONSORED_MESSAGE:
          return Object.assign({}, state, {
            sponsoredMessage: action.data
          })
      case ActionTypes.UPDATE_SPONSORED_MESSAGE:
      return Object.assign({}, state, {
        sponsoredMessage: action.data
      })
      default:
        return state
    }
  }
