import * as ActionTypes from '../constants/constants'

// const initialState = {
//   surveys: []
// }

export function surveysInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data
      })
    case ActionTypes.ADD_SURVEY:
      return Object.assign({}, state, {
        surveys: [...state.surveys, action.data.payload],
        createwarning: action.data.status

      })
    case ActionTypes.ADD_RESPONSES:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions,
        responses: action.responses
      })
    case ActionTypes.LOAD_SURVEYS_QUESTIONS:
      return Object.assign({}, state, {
        questions: action.questions,
        survey: action.survey
      })
    case ActionTypes.SUBMIT_SURVEY:
      return Object.assign({}, state, {
        response: action.response
      })
    default:
      return state
  }
}
