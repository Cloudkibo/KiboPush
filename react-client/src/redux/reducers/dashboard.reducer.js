import * as ActionTypes from '../constants/constants'

const initialState = {
  slaDashboard: null,
  slaDashboardError: '',
  fetchingSLADashboard: false,
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
  sentseendata: {
    broadcast: { broadcastSentCount: 0, broadcastSeenCount: 0 },
    poll: { pollSentCount: 0, pollSeenCount: 0, pollResponseCount: 0 },
    survey: { surveySentCount: 0, surveySeenCount: 0, surveyResponseCount: 0 },
    sessions: { count: 0, resolved: 0 },
    bots: { count: 0, responded: 0 }
  },
  topPages: []
}

export function dashboardInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCHING_SLA_DASHBOARD: {
      return Object.assign({}, state, { fetchingSLADashboard: true })
    }
    case ActionTypes.UPDATE_SLA_DASHBOARD: {
      const updatedState = { slaDashboardError: '', fetchingSLADashboard: false }
      if (action.data) {
        updatedState.slaDashboard = action.data
      } else if (action.error) {
        updatedState.slaDashboardError = action.error
      }
      return Object.assign({}, state, updatedState)
    }
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
    case ActionTypes.UPDATE_SUBSCRIBER_SUMMARY:
      return Object.assign({}, state, {
        subscriberSummary: action.data
      })
    case ActionTypes.UPDATE_AUTOPOSTING_SUMMARY:
      return Object.assign({}, state, {
        autopostingSummary: action.data
      })
    case ActionTypes.UPDATE_INTEGRATIONS_SUMMARY:
      return Object.assign({}, state, {
        integrationsSummary: action.data
      })
    case ActionTypes.UPDATE_NEWS_SUMMARY:
      return Object.assign({}, state, {
        newsSummary: action.data
      })
    default:
      return state
  }
}
