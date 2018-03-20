import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import fileDownload from 'js-file-download'
export const API_URL = '/api'

export function updateUsersList (data) {
  var locale = [{ value: data.payload[0].locale, label: data.payload[0].locale }]
  var tempLocale = [data.payload[0].locale]
  for (var i = 1; i < data.payload.length; i++) {
    if (tempLocale.indexOf(data.payload[i].locale) === -1) {
      var temp = { value: data.payload[i].locale, label: data.payload[i].locale }
      locale.push(temp)
      tempLocale.push(data.payload[i].locale)
    }
  }
  return {
    type: ActionTypes.LOAD_USERS_LIST,
    data: data.payload,
    locale
  }
}

export function loadUsersList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('backdoor/alluser').then(res => dispatch(updateUsersList(res)))
  }
}
export function updateDataObjectsCount (data) {
  return {
    type: ActionTypes.LOAD_DATA_OBJECTS_LIST,
    data: data.payload
  }
}

export function loadDataObjectsCount (id) {
  return (dispatch) => {
    callApi(`backdoor/datacount/${id}`).then(res => {
      console.log('res', res)
      dispatch(updateDataObjectsCount(res))
    })
  }
}
export function updateTopPages (data) {
  return {
    type: ActionTypes.LOAD_TOP_PAGES_LIST,
    data: data.payload
  }
}

export function loadTopPages () {
  return (dispatch) => {
    callApi('backdoor/toppages').then(res => dispatch(updateTopPages(res)))
  }
}
export function updatePagesList (data) {
  return {
    type: ActionTypes.LOAD_BACKDOOR_PAGES_LIST,
    data: data.payload
  }
}
export function updateSurveysGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_GRAPH,
    data
  }
}

export function loadSurveysGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/surveysGraph/${days}`)
      .then(res => dispatch(updateSurveysGraphData(res.payload)))
  }
}
export function updatePollsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_GRAPH,
    data
  }
}

export function loadPollsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/pollsGraph/${days}`)
      .then(res => dispatch(updatePollsGraphData(res.payload)))
  }
}
export function updatePollsByDays (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_BY_DAYS,
    data
  }
}

export function loadPollsByDays (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/pollsByDays/${days}`)
      .then(res => dispatch(updatePollsByDays(res.payload)))
  }
}
export function updateSurveysByDays (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_BY_DAYS,
    data
  }
}

export function loadSurveysByDays (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/surveysByDays/${days}`)
      .then(res => dispatch(updateSurveysByDays(res.payload)))
  }
}
export function updateBroadcastsByDays (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_BY_DAYS,
    data
  }
}

export function loadBroadcastsByDays (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/broadcastsByDays/${days}`)
      .then(res => dispatch(updateBroadcastsByDays(res.payload)))
  }
}
export function updateBroadcastsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_GRAPH,
    data
  }
}

export function loadBroadcastsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/broadcastsGraph/${days}`)
      .then(res => dispatch(updateBroadcastsGraphData(res.payload)))
  }
}
export function updateSessionsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_GRAPH,
    data
  }
}

export function loadSessionsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/sessionsGraph/${days}`)
      .then(res => dispatch(updateSessionsGraphData(res.payload)))
  }
}
export function loadPagesList (id) {
  // here we will fetch list of user pages from endpoint
  return (dispatch) => {
    callApi(`backdoor/allpages/${id}`).then(res => dispatch(updatePagesList(res)))
  }
}

export function updateBroadcastsList (data) {
  return {
    type: ActionTypes.LOAD_BROADCASTS_LIST,
    data: data.payload.reverse()
  }
}

export function loadBroadcastsList (id) {
  return (dispatch) => {
    callApi(`backdoor/allbroadcasts/${id}`)
      .then(res => dispatch(updateBroadcastsList(res)))
  }
}

export function updatePollList (data) {
  return {
    type: ActionTypes.LOAD_POLLS_LIST,
    data: data.payload.reverse()
  }
}
export function loadPollsList (id) {
  return (dispatch) => {
    callApi(`backdoor/allpolls/${id}`)
      .then(res => dispatch(updatePollList(res)))
  }
}

export function updatePageSubscribersList (data) {
  var locale = [{ value: data.payload[0].locale, label: data.payload[0].locale }]
  var tempLocale = [data.payload[0].locale]
  for (var i = 1; i < data.payload.length; i++) {
    if (tempLocale.indexOf(data.payload[i].locale) === -1) {
      var temp = { value: data.payload[i].locale, label: data.payload[i].locale }
      locale.push(temp)
      tempLocale.push(data.payload[i].locale)
    }
  }
  return {
    type: ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST,
    data: data.payload,
    locale
  }
}

export function loadPageSubscribersList (id) {
  return (dispatch) => {
    callApi(`backdoor/allsubscribers/${id}`)
      .then(res => dispatch(updatePageSubscribersList(res)))
  }
}

export function updateSurveysList (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: data.payload.reverse()
  }
}
export function loadSurveysList (id) {
  return (dispatch) => {
    callApi(`backdoor/allsurveys/${id}`)
      .then(res => dispatch(updateSurveysList(res)))
  }
}
export function updateSurveyDetails (data) {
  return {
    type: ActionTypes.LOAD_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions,
    responses: data.payload.responses
  }
}
export function updatePollDetails (data) {

  return {
    type: ActionTypes.LOAD_POLL_DETAILS,
    data: data.payload
  }
}
export function loadSurveyDetails (id) {
  return (dispatch) => {
    callApi(`backdoor/surveyDetails/${id}`)
      .then(res => dispatch(updateSurveyDetails(res)))
  }
}
export function loadPollDetails (id) {
  return (dispatch) => {
    callApi(`backdoor/polls/${id}`)
      .then(res => dispatch(updatePollDetails(res)))
  }
}
export function saveUserInformation (user) {
  return {
    type: ActionTypes.SAVE_USER_INFORMATION,
    data: user
  }
}
export function savePageInformation (page) {
  return {
    type: ActionTypes.SAVE_PAGE_INFORMATION,
    data: page
  }
}
export function saveSurveyInformation (survey) {
  return {
    type: ActionTypes.SAVE_SURVEY_INFORMATION,
    data: survey
  }
}
export function saveCurrentPoll (poll) {
  return {
    type: ActionTypes.SAVE_CURRENT_POLL,
    data: poll
  }
}
export function fileStatus (data) {
  return {
    type: ActionTypes.DOWNLOAD_FILE,
    data
  }
}
export function downloadFile () {
  return (dispatch) => {
    callApi(`backdoor/uploadFile`)
    .then(function (data) {
      fileDownload(data.payload, 'users.csv')
    })
  }
}
