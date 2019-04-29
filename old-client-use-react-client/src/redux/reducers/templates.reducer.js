import * as ActionTypes from '../constants/constants'

// const initialState = {
//   surveys: []
// }

export function templatesInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_CATEGORY_LIST:
      return Object.assign({}, state, {
        categories: action.data
      })
    case ActionTypes.ADD_TEMPLATE_SURVEY:
      return Object.assign({}, state, {
        surveyCreated: [...state.surveys, action.data.payload],
        createwarning: action.data.status

      })
    case ActionTypes.ADD_TEMPLATE_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: action.data.payload
      })
    case ActionTypes.ADD_TEMPLATE_POLL:
      return Object.assign({}, state, {
        pollCreated: [...state.polls, action.data.payload],
        createwarning: action.data.status
      })
    case ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data,
        surveyCreated: '',
        warning: ''
      })
    case ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST_NEW:
      return Object.assign({}, state, {
        surveys: action.surveys,
        surveysCount: action.count,
        surveyCreated: '',
        pollCreated: ''
      })
    case ActionTypes.LOAD_TEMPLATE_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data,
        pollCreated: '',
        warning: ''
      })
    case ActionTypes.LOAD_TEMPLATE_POLLS_LIST_NEW:
      return Object.assign({}, state, {
        polls: action.polls,
        pollsCount: action.count,
        pollCreated: ''
      })
    case ActionTypes.LOAD_TEMPLATE_SURVEY_DETAILS:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions
      })
    case ActionTypes.LOAD_TEMPLATE_POLL_DETAILS:
      return Object.assign({}, state, {
        pollDetails: action.data
      })
    case ActionTypes.LOAD_TEMPLATE_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data
      })
    case ActionTypes.LOAD_TEMPLATE_BROADCASTS_LIST_NEW:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        broadcastsCount: action.count
      })
    case ActionTypes.LOAD_TEMPLATE_BROADCAST_DETAILS:
      return Object.assign({}, state, {
        broadcastDetails: action.data
      })
    case ActionTypes.SAVE_BROADCAST_INFORMATION:
      console.log('getCurrentBroadcast', action.data)
      return Object.assign({}, state, {
        currentBroadcast: action.data
      })
    case ActionTypes.TEMPLATES_WARNING:
      return Object.assign({}, state, {
        warning: action.data
      })
    default:
      return state
  }
}
