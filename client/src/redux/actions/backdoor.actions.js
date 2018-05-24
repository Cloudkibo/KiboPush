import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import fileDownload from 'js-file-download'
export const API_URL = '/api'

export function getLocales (data) {
  if (data.length > 0) {
    var locale = [{ value: data[0].facebookInfo.locale, label: data[0].facebookInfo.locale }]
    var tempLocale = [data[0].facebookInfo.locale]
    for (var i = 1; i < data.length; i++) {
      if (data[i].facebookInfo && tempLocale.indexOf(data[i].facebookInfo.locale) === -1) {
        var temp = { value: data[i].facebookInfo.locale, label: data[i].facebookInfo.locale }
        locale.push(temp)
        tempLocale.push(data[i].facebookInfo.locale)
      }
    }
    console.log('locale', locale)
    return locale
  }
}

export function updateUsersList (data, originalData) {
  if (originalData.first_page && (originalData.search_value !== '' || originalData.locale_value !== '' || originalData.gender_value !== '')) {
    return {
      type: ActionTypes.LOAD_USERS_LIST_FILTERS,
      data: data.users,
      count: data.count,
      locale: getLocales(data.users)
    }
  } else {
    return {
      type: ActionTypes.LOAD_USERS_LIST,
      data: data.users,
      count: data.count,
      locale: getLocales(data.users)
    }
  }
}

export function updateAllLocales (data) {
  console.log('Data Fetched From backdoor', data)
  return {
    type: ActionTypes.LOAD_LOCALES_LIST_BACKDOOR,
    data
  }
}

export function updateDataObjectsCount (data) {
  return {
    type: ActionTypes.LOAD_DATA_OBJECTS_LIST,
    data: data.payload
  }
}

export function updateTopPages (data) {
  console.log('toppages', data.payload)
  return {
    type: ActionTypes.LOAD_TOP_PAGES_LIST,
    data: data.payload
  }
}

export function updatePagesList (data) {
  return {
    type: ActionTypes.LOAD_BACKDOOR_PAGES_LIST,
    data: data.pages,
    count: data.count
  }
}

export function updateSurveysGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_GRAPH,
    data
  }
}

export function updatePollsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_GRAPH,
    data
  }
}

export function updatePollsByDays (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_BY_DAYS,
    polls: data.polls,
    count: data.count
  }
}

export function updateSurveysByDays (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_BY_DAYS,
    surveys: data.surveys,
    count: data.count
  }
}

export function updateBroadcastsByDays (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_BY_DAYS,
    broadcasts: data.broadcasts,
    count: data.count
  }
}

export function updateBroadcastsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_GRAPH,
    data
  }
}

export function updateSessionsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_GRAPH,
    data
  }
}

export function updateBroadcastsList (data) {
  return {
    type: ActionTypes.LOAD_BROADCASTS_LIST,
    data: data.broadcasts,
    count: data.count
  }
}

export function updatePollList (data) {
  return {
    type: ActionTypes.LOAD_POLLS_LIST,
    data: data.polls,
    count: data.count
  }
}

export function updateSurveysList (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: data.surveys,
    count: data.count
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

export function updatePageSubscribersList (data) {
  return {
    type: ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST,
    data: data.subscribers,
    locale: getLocales(data.subscribers),
    count: data.count
  }
}

export function updatePollDetails (data) {
  return {
    type: ActionTypes.LOAD_POLL_DETAILS,
    data: data.payload
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

export function loadUsersList (data) {
  // here we will fetch list of subscribers from endpoint
  console.log('data for getAllUsers', data)
  return (dispatch) => {
    callApi('backdoor/getAllUsers', 'post', data).then(res => {
      console.log('response from getAllUsers', res)
      dispatch(updateUsersList(res.payload, data))
    })
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

export function loadTopPages () {
  return (dispatch) => {
    callApi('backdoor/toppages').then(res => {
      console.log('response from toppages', res)
      dispatch(updateTopPages(res))
    })
  }
}

export function loadSurveysGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/surveysGraph/${days}`)
      .then(res => dispatch(updateSurveysGraphData(res.payload)))
  }
}

export function loadPollsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/pollsGraph/${days}`)
      .then(res => dispatch(updatePollsGraphData(res.payload)))
  }
}

export function loadPollsByDays (data) {
  // here we will fetch list of subscribers from endpoint
  console.log('data for loadPollsByDays', data)
  return (dispatch) => {
    callApi(`backdoor/getAllPolls`, 'post', data)
      .then(res => {
        console.log('response from loadPollsByDays', res)
        dispatch(updatePollsByDays(res.payload))
      })
  }
}

export function loadSurveysByDays (data) {
  // here we will fetch list of subscribers from endpoint
  console.log('data for loadSurveysByDays', data)
  return (dispatch) => {
    callApi(`backdoor/getAllSurveys`, 'post', data)
      .then(res => {
        console.log('response from surveysByDays', res)
        dispatch(updateSurveysByDays(res.payload))
      })
  }
}

export function loadBroadcastsByDays (data) {
  // here we will fetch list of subscribers from endpoint
  console.log('data for loadBroadcastsByDays', data)
  return (dispatch) => {
    callApi(`backdoor/getAllBroadcasts`, 'post', data)
      .then(res => {
        console.log('response from loadBroadcastsByDays', res)
        dispatch(updateBroadcastsByDays(res.payload))
      })
  }
}

export function loadBroadcastsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/broadcastsGraph/${days}`)
      .then(res => dispatch(updateBroadcastsGraphData(res.payload)))
  }
}

export function loadSessionsGraphData (days) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`backdoor/sessionsGraph/${days}`)
      .then(res => dispatch(updateSessionsGraphData(res.payload)))
  }
}
export function loadPagesList (id, data) {
  // here we will fetch list of user pages from endpoint
  console.log('data for loadPagesList', data)
  return (dispatch) => {
    callApi(`backdoor/getAllPages/${id}`, 'post', data).then(res => {
      console.log('response from allpages', res)
      dispatch(updatePagesList(res.payload))
    })
  }
}

export function loadBroadcastsList (id, data) {
  return (dispatch) => {
    callApi(`backdoor/allUserBroadcasts/${id}`, 'post', data)
      .then(res => dispatch(updateBroadcastsList(res.payload)))
  }
}

export function loadPollsList (id, data) {
  console.log('data for loadPollsList', data)
  return (dispatch) => {
    callApi(`backdoor/allUserPolls/${id}`, 'post', data)
      .then(res => dispatch(updatePollList(res.payload)))
  }
}

export function loadPageSubscribersList (id, data) {
  console.log('data for loadPageSubscribersList', data)
  return (dispatch) => {
    callApi(`backdoor/getAllSubscribers/${id}`, 'post', data)
      .then(res => {
        console.log('response from loadPageSubscribersList', res)
        dispatch(updatePageSubscribersList(res.payload))
      })
  }
}

export function loadSurveysList (id, data) {
  return (dispatch) => {
    callApi(`backdoor/allUserSurveys/${id}`, 'post', data)
      .then(res => {
        console.log('response from surveys', res)
        dispatch(updateSurveysList(res.payload))
      })
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

export function downloadFile () {
  return (dispatch) => {
    callApi(`backdoor/uploadFile`)
    .then(function (data) {
      fileDownload(data.payload, 'users.csv')
    })
  }
}
export function sendEmail (msg) {
  return (dispatch) => {
    callApi(`backdoor/sendEmail`)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Email sent successfully!')
        } else {
          msg.error('Email not sent')
        }
      })
  }
}
export function allLocales () {
  return (dispatch) => {
    callApi('backdoor/allLocales').then(res => dispatch(updateAllLocales(res.payload)))
  }
}
