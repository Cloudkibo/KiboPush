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
        surveys: [...state.surveys, action.data.payload],
        createwarning: action.data.status

      })
    case ActionTypes.ADD_TEMPLATE_POLL:
      return Object.assign({}, state, {
        surveys: [...state.polls, action.data.payload],
        createwarning: action.data.status
      })
    case ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data
      })
    case ActionTypes.LOAD_TEMPLATE_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data
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
    default:
      return state
  }
}
