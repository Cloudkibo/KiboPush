import * as ActionTypes from '../constants/constants'

const initialState = {
  users: [],
  broadcasts: [],
  pages: [],
  polls: [],
  dataobjects: [],
  toppages: [],
  surveyDetails: [],
  currentUser: null,
  currentPage: null,
  currentSurvey: null,
  currentPoll: null,
  pollDetails: null,
  broadcastsGraphInfo: [],
  surveysGraphInfo: [],
  pollsGraphInfo: [],
  sessionsGraphInfo: []
}

export function backdoorInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_USERS_LIST:
      return Object.assign({}, state, {
        users: action.data,
        locales: action.locale
      })

    case ActionTypes.LOAD_DATA_OBJECTS_LIST:
      return Object.assign({}, state, {
        dataobjects: action.data
      })

    case ActionTypes.LOAD_TOP_PAGES_LIST:
      return Object.assign({}, state, {
        toppages: action.data
      })

    case ActionTypes.LOAD_BACKDOOR_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })

    case ActionTypes.LOAD_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data
      })

    case ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        pageSubscribers: action.data,
        locales: action.locale
      })

    case ActionTypes.LOAD_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data
      })

    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data
      })

    case ActionTypes.LOAD_SURVEY_DETAILS:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions,
        responses: action.responses
      })

    case ActionTypes.LOAD_POLL_DETAILS:
      return Object.assign({}, state, {
        pollDetails: action.data
      })

    case ActionTypes.SAVE_USER_INFORMATION:
      return Object.assign({}, state, {
        currentUser: action.data
      })

    case ActionTypes.SAVE_PAGE_INFORMATION:
      return Object.assign({}, state, {
        currentPage: action.data
      })

    case ActionTypes.SAVE_SURVEY_INFORMATION:
      return Object.assign({}, state, {
        currentSurvey: action.data
      })

    case ActionTypes.SAVE_CURRENT_POLL:
      return Object.assign({}, state, {
        currentPoll: action.data
      })

    case ActionTypes.UPDATE_SURVEYS_GRAPH:
      return Object.assign({}, state, {
        surveysGraphInfo: action.data
      })

    case ActionTypes.UPDATE_POLLS_GRAPH:
      return Object.assign({}, state, {
        pollsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_BROADCASTS_GRAPH:
      return Object.assign({}, state, {
        broadcastsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_SESSIONS_GRAPH:
      return Object.assign({}, state, {
        sessionsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_BROADCASTS_BY_DAYS:
      return Object.assign({}, state, {
        broadcasts: action.data
      })

    case ActionTypes.UPDATE_POLLS_BY_DAYS:
      return Object.assign({}, state, {
        polls: action.data
      })

    case ActionTypes.UPDATE_SURVEYS_BY_DAYS:
      return Object.assign({}, state, {
        surveys: action.data
      })

    default:
      return state
  }
}
