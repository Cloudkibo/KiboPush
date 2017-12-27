import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export function createsurvey (survey) {
  console.log('Creating survey')
  console.log(survey)
  return (dispatch) => {
    callApi('templates/createSurvey', 'post', survey)
      .then(res => dispatch(addSurvey(res)))
  }
}

export function addPoll (data, msg) {
  console.log('response from createpoll', data)
  return {
    type: ActionTypes.ADD_TEMPLATE_POLL,
    data
  }
}
export function createpoll (poll) {
  console.log('Creating survey')
  console.log(poll)
  return (dispatch) => {
    callApi('templates/createPoll', 'post', poll)
      .then(res => dispatch(addPoll(res)))
  }
}

export function addSurvey (data, msg) {
  console.log('response from createsurvey', data)
  if (data.status === 'success') {
    msg.success('Survey created successfully')
  }
  return {
    type: ActionTypes.ADD_TEMPLATE_SURVEY,
    data
  }
}
export function addCategory (data, msg) {
  return (dispatch) => {
    callApi('templates/createCategory', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Category added successfully')
        } else {
          msg.success('Please enter a category')
        }
      })
  }
}
export function showCategories (data) {
  return {
    type: ActionTypes.LOAD_CATEGORY_LIST,
    data
  }
}
export function loadCategoriesList () {
  console.log('loadCartegoriesList called')
  return (dispatch) => {
    callApi('templates/allCategories').then(res => dispatch(showCategories(res.payload)))
  }
}
export function showSurveys (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST,
    data
  }
}
export function loadSurveysList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList called')
  return (dispatch) => {
    callApi('templates/allSurveys').then(res => dispatch(showSurveys(res.payload)))
  }
}
export function showPolls (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_POLLS_LIST,
    data
  }
}
export function loadPollsList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadPollsList called')
  return (dispatch) => {
    callApi('templates/allPolls').then(res => dispatch(showPolls(res.payload)))
  }
}
export function updateSurveyDetails (data) {
  console.log('updateSurveysDetails', data.payload.survey)
  console.log('updateSurveysDetails', data.payload.questions)
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions
  }
}
export function updatePollDetails (data) {
  console.log('updatePollDetails', data.payload)

  return {
    type: ActionTypes.LOAD_TEMPLATE_POLL_DETAILS,
    data: data.payload
  }
}
export function loadSurveyDetails (id) {
  console.log('loadSurveyDetails called: ', id)
  return (dispatch) => {
    callApi(`templates/surveyDetails/${id}`)
      .then(res => dispatch(updateSurveyDetails(res)))
  }
}
export function loadPollDetails (id) {
  console.log('loadPollDetails called: ', id)
  return (dispatch) => {
    callApi(`templates/pollDetails/${id}`)
      .then(res => dispatch(updatePollDetails(res)))
  }
}
