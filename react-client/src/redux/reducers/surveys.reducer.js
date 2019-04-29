import * as ActionTypes from '../constants/constants'

// const initialState = {
//   surveys: []
// }

export function surveysInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data,
        surveyCreated: '',
        warning: ''
      })
    case ActionTypes.LOAD_SURVEYS_LIST_NEW:
      return Object.assign({}, state, {
        surveys: action.data,
        count: action.count,
        surveyCreated: '',
        warning: ''
      })
    case ActionTypes.ADD_SURVEY:
      return Object.assign({}, state, {
        surveyCreated: action.data,
        warning: ''
      })
    case ActionTypes.ADD_RESPONSES:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions,
        responses: action.responses,
        warning: ''
      })
    case ActionTypes.LOAD_SURVEYS_QUESTIONS:
      return Object.assign({}, state, {
        questions: action.questions,
        survey: action.survey,
        warning: ''
      })
    case ActionTypes.SEND_SURVEY_SUCCESS:
      return Object.assign({}, state, {
        successTime: new Date().getTime(),
        successMessage: 'Survey sent successfully.',
        surveyCreated: '',
        warning: ''
      })

    case ActionTypes.SEND_SURVEY_FAILURE:
      return Object.assign({}, state, {
        errorTime: new Date().getTime(),
        errorMessage: 'Survey Sending Failed.',
        surveyCreated: '',
        warning: ''
      })
    case ActionTypes.SUBMIT_SURVEY:
      return Object.assign({}, state, {
        response: action.response,
        warning: ''
      })
    case ActionTypes.SURVEYS_WARNING:
      return Object.assign({}, state, {
        warning: action.data
      })
    default:
      return state
  }
}
