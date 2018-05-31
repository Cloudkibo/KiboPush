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
  },
  graphData: {
    broadcastsgraphdata: [],
    pollsgraphdata: [],
    surveysgraphdata: [],
    sessionsgraphdata: []
  },
  topPages: []
}

export function dashboardInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DASHBOARD:
      return Object.assign({}, state, {
        dashboard: action.data
      })

    case ActionTypes.UPDATE_SENT_VS_SEEN:
      return Object.assign({}, state, {
        sentseendata: action.data
      })
    case ActionTypes.UPDATE_GRAPH_DATA:
      return Object.assign({}, state, {
        graphData: action.data
      })
    case ActionTypes.UPDATE_TOP_PAGES:
      return Object.assign({}, state, {
        topPages: action.data
      })
    case ActionTypes.VIEW_PAGE_SUBSCRIBERS_LIST_DASHBOARD:
      return Object.assign({}, state, {
        pageSubscribers: action.data,
        //  locales: action.locale,
        subscribersCount: action.count
      })
    case ActionTypes.LOAD_LOCALES_LIST_DASHBOARD:
      return Object.assign({}, state, {
        locales: action.data
      })
    default:
      return state
  }
}
