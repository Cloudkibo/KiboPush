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
        ad_set_payload: {
            name: '',
            bid_amount: '',
            daily_budget: '',
            adset_id: ''
        },
        payload: ''
    }
}

export function sponsoredMessagingInfo (state = initialState, action) {
    switch (action.type) {
      case ActionTypes.SHOW_SPONSORED_MESSAGES:
        return Object.assign({}, state, {
          sponsoredMessages: action.data
        })
      default:
        return state
    }
  }