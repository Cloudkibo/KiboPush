/* eslint-disable no-undef */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function appendSentSeenResponsesData (data) {
  let surveys = data.surveys
  let pagesurveys = data.surveypages
  //  let responsesCount = data.responsesCount

  for (let j = 0; j < surveys.length; j++) {
    let pagesurvey = pagesurveys.filter((c) => c.surveyId === surveys[j]._id)
    let pageSurveyDelivered = pagesurvey.filter((c) => c.sent === true)
    let pagesurveyTapped = pagesurvey.filter((c) => c.seen === true)
    surveys[j].sent = pagesurvey.length
    surveys[j].delivered = pageSurveyDelivered.length // total delivered
    surveys[j].seen = pagesurveyTapped.length // total tapped
    surveys[j].responses = surveys[j].isresponded
  }
  // var newSurvey = surveys.reverse()
  return surveys
}

export function showSurveys (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: appendSentSeenResponsesData(data)
  }
}
export function showWarning (data) {
  return {
    type: ActionTypes.SURVEYS_WARNING,
    data: data
  }
}
export function showSurveysNew (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST_NEW,
    data: appendSentSeenResponsesData(data),
    count: data.count
  }
}

export function submitresponse (data) {
  return {
    type: ActionTypes.SUBMIT_SURVEY,
    response: data
  }
}
export function showSurveyQuestions (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_QUESTIONS,
    survey: data.survey,
    questions: data.questions
  }
}

export function addSurvey (data) {
  return {
    type: ActionTypes.ADD_SURVEY,
    data
  }
}

export function sendSurveySuccess () {
  return {
    type: ActionTypes.SEND_SURVEY_SUCCESS
  }
}

export function sendSurveyFailure () {
  return {
    type: ActionTypes.SEND_SURVEY_FAILURE
  }
}

export function showSurveyResponse (data) {
  return {
    type: ActionTypes.ADD_RESPONSES,
    survey: data.survey,
    questions: data.questions,
    responses: data.responses
  }
}

export function loadSurveysList (days) {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList/days')
  return (dispatch) => {
    callApi(`surveys/all/${days}`).then(res => dispatch(showSurveys(res.payload)))
  }
}
export function loadSurveysListNew (data) {
  console.log('data for loadSurveysListNew', data)
  return (dispatch) => {
    callApi(`surveys/allSurveys`, 'post', data).then(res => {
      console.log('response from surveys', res)
      dispatch(showSurveysNew(res.payload))
    })
  }
}
export function sendsurvey (survey, msg) {
  return (dispatch) => {
    callApi(`surveys/send`, 'post', survey)
      .then(res => {
        console.log('sendsurveyresponse', res)
        if (res.status === 'success') {
          msg.success('Survey sent successfully')
          dispatch(sendSurveySuccess())
        } else {
          msg.error(res.description)
          dispatch(sendSurveyFailure())
        }
      })
  }
}
export function sendSurveyDirectly (survey, msg) {
  return (dispatch) => {
    callApi(`surveys/sendSurveyDirectly`, 'post', survey)
      .then(res => {
        console.log('sendsurveyresponse', res)
        if (res.status === 'success') {
          msg.success('Survey sent successfully')
        } else {
          msg.error(res.description)
          dispatch(showWarning(res.description))
        }
      })
  }
}
export function getsurveyform (id) {
  return (dispatch) => {
    callApi(`surveys/showquestions/${id}`)
      .then(res => dispatch(showSurveyQuestions(res.payload)))
  }
}

export function submitsurvey (survey) {
  return (dispatch) => {
    callApi(`surveys/submitresponse`, 'post', survey)
      .then(res => dispatch(submitresponse(res.payload)))
  }
}
export function createsurvey (survey) {
  return (dispatch) => {
    callApi('surveys/create', 'post', survey)
      .then(res => {
        if (res.status === 'success') {
          dispatch(addSurvey(res.payload))
        } else {
          dispatch(showWarning(res.description))
        }
      })
  }
}

export function loadsurveyresponses (surveyid) {
  // surveyid is the _id of survey
  return (dispatch) => {
    callApi(`surveys/${surveyid}`)
      .then(res => dispatch(showSurveyResponse(res.payload)))
  }
}
export function deleteSurvey (id, msg, data) {
  return (dispatch) => {
    callApi(`surveys/deleteSurvey/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Survey deleted successfully')
          dispatch(loadSurveysListNew(data))
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete survey. ${res.description}`)
          } else {
            msg.error('Failed to delete survey')
          }
        }
      })
  }
}
