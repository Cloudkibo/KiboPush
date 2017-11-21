import * as ActionTypes from '../constants/constants'

const initialState = {
  dashboard: {
    pages: 0,
    subscribers: 0,
    scheduledBroadcast: 0,
    tour: false,
    recentBroadcasts: [],
    username: '',
    activityChart: {
      polls: 0,
      messages: 0,
      surveys: 0
    }
  }
}
export function sentSeenInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SENT_VS_SEEN:
      return Object.assign({}, state, {
        sentseendata: action.data
      })

    default:
      return state
  }
}
export function dashboardInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DASHBOARD:
      return Object.assign({}, state, {
        dashboard: action.data
      })

    default:
      return state
  }
}
