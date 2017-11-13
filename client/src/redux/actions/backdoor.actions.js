import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function updateUsersList (data) {
  console.log('Data Fetched From Users', data)
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
  console.log('loadUsersList called')
  return (dispatch) => {
    callApi('backdoor/alluser').then(res => dispatch(updateUsersList(res)))
  }
}
export function updateDataObjectsCount (data) {
  console.log('Data Fetched From data objects', JSON.stringify(data.payload))
  return {
    type: ActionTypes.LOAD_DATA_OBJECTS_LIST,
    data: data.payload
  }
}

export function loadDataObjectsCount (id) {
  console.log('loadDataObjectsCount called', id)
  return (dispatch) => {
    callApi(`backdoor/datacount/${id}`).then(res => {
      console.log('res', res)
      dispatch(updateDataObjectsCount(res))
    })
  }
}
export function updateTopPages (data) {
  console.log('Data Fetched From top pages', data)
  return {
    type: ActionTypes.LOAD_TOP_PAGES_LIST,
    data: data.payload
  }
}

export function loadTopPages () {
  console.log('loadTopPagesCount called')
  return (dispatch) => {
    callApi('backdoor/toppages').then(res => dispatch(updateTopPages(res)))
  }
}
export function updatePagesList (data) {
  console.log('Users Created Pages', data)
  return {
    type: ActionTypes.LOAD_BACKDOOR_PAGES_LIST,
    data: data.payload
  }
}
export function updateSurveysGraphData (data) {
  console.log('Chats Count From Server', data)
  return {
    type: ActionTypes.UPDATE_SURVEYS_GRAPH,
    data
  }
}

export function loadSurveysGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSurveysGraphData called', days)
  return (dispatch) => {
    callApi(`backdoor/surveysGraph/${days}`)
      .then(res => dispatch(updateSurveysGraphData(res.payload)))
  }
}
export function updatePollsGraphData (data) {
  console.log('Chats Count From Server', data)
  return {
    type: ActionTypes.UPDATE_POLLS_GRAPH,
    data
  }
}

export function loadPollsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  console.log('loadPollsGraphData called', days)
  return (dispatch) => {
    callApi(`backdoor/pollsGraph/${days}`)
      .then(res => dispatch(updatePollsGraphData(res.payload)))
  }
}
export function updateBroadcastsGraphData (data) {
  console.log('Broadcasts Count From Server', data)
  return {
    type: ActionTypes.UPDATE_BROADCASTS_GRAPH,
    data
  }
}

export function loadBroadcastsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  console.log('loadBroadcastsGraphData called', days)
  return (dispatch) => {
    callApi(`backdoor/broadcastsGraph/${days}`)
      .then(res => dispatch(updateBroadcastsGraphData(res.payload)))
  }
}
export function loadPagesList (id) {
  // here we will fetch list of user pages from endpoint
  console.log('loadPagesList called', id)
  return (dispatch) => {
    callApi(`backdoor/allpages/${id}`).then(res => dispatch(updatePagesList(res)))
  }
}

export function updateBroadcastsList (data) {
  console.log('updateBroadcastsList', data.payload)
  return {
    type: ActionTypes.LOAD_BROADCASTS_LIST,
    data: data.payload.reverse()
  }
}

export function loadBroadcastsList (id) {
  console.log('loadBroadcastsList called', id)
  return (dispatch) => {
    callApi(`backdoor/allbroadcasts/${id}`)
      .then(res => dispatch(updateBroadcastsList(res)))
  }
}

export function updatePollList (data) {
  console.log('updatePollList', data.payload)
  return {
    type: ActionTypes.LOAD_POLLS_LIST,
    data: data.payload.reverse()
  }
}
export function loadPollsList (id) {
  console.log('load Polls called: ', id)
  return (dispatch) => {
    callApi(`backdoor/allpolls/${id}`)
      .then(res => dispatch(updatePollList(res)))
  }
}

export function updatePageSubscribersList (data) {
  console.log('updatePageSubscribersList', data.payload)
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
  console.log('loadPageSubscribersList called', id)
  return (dispatch) => {
    callApi(`backdoor/allsubscribers/${id}`)
      .then(res => dispatch(updatePageSubscribersList(res)))
  }
}

export function updateSurveysList (data) {
  console.log('updateSurveysList', data.payload)
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: data.payload.reverse()
  }
}
export function loadSurveysList (id) {
  console.log('load Surveys called: ', id)
  return (dispatch) => {
    callApi(`backdoor/allsurveys/${id}`)
      .then(res => dispatch(updateSurveysList(res)))
  }
}
export function updateSurveyDetails (data) {
  console.log('updateSurveysDetails', data.payload.survey)
  console.log('updateSurveysDetails', data.payload.questions)
  console.log('updateSurveysDetails', data.payload.responses)
  return {
    type: ActionTypes.LOAD_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions,
    responses: data.payload.responses
  }
}
export function updatePollDetails (data) {
  console.log('updatePollDetails', data.payload)

  return {
    type: ActionTypes.LOAD_POLL_DETAILS,
    data: data.payload
  }
}
export function loadSurveyDetails (id) {
  console.log('loadSurveyDetails called: ', id)
  return (dispatch) => {
    callApi(`backdoor/surveyDetails/${id}`)
      .then(res => dispatch(updateSurveyDetails(res)))
  }
}
export function loadPollDetails (id) {
  console.log('loadPollDetails called: ', id)
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
  console.log('fileStatus1', data)
}
export function downloadFile () {
  console.log('downloadFile called')
  return (dispatch) => {
    callApi(`backdoor/uploadFile`)
        .then(res => {
          dispatch(fileStatus(res))
          console.log('res', res)
        })
  }

  // return (dispatch) => {
  //   fetch(`${API_URL}/backdoor/uploadFile`, {
  //       credentials: 'same-origin',
  //       method: 'post',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify(data)
  //     }).then(function (response) {
  //       return response.blob()
  //     }).then(function (blob) {
  //       FileSaver.saveAs(blob, 'nameFile.zip')
  //     })
  // }
  // return (dispatch) => {
  //   // eslint-disable-next-line no-undef
  //   fetch(`${API_URL}/backdoor/uploadFile`, {
  //     credentials: 'same-origin',
  //     method: 'get',
  //     headers: {'Content-Type': 'application/json'}
  //     //  body: JSON.stringify(data)
  //   }).then(function (response) {
  //     return response.blob()
  //   }).then(function (blob) {
  //     FileSaver.saveAs(blob, 'nameFile.csv')
  //   })
  // }
}
