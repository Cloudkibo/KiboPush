import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
import FileSaver from 'file-saver'
import FileDownload from 'react-file-download'
import Axios from 'axios'
import Blob from 'blob'
export const API_URL = '/api'

export function updateUsersList (data) {
  console.log('Data Fetched From Users', data)
  return {
    type: ActionTypes.LOAD_USERS_LIST,
    data: data.payload
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

export function loadDataObjectsCount () {
  console.log('loadDataObjectsCount called')
  return (dispatch) => {
    callApi('backdoor/datacount').then(res => dispatch(updateDataObjectsCount(res)))
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
  return {
    type: ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST,
    data: data.payload
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

export function saveUserInformation (user) {
  return {
    type: ActionTypes.SAVE_USER_INFORMATION,
    data: user
  }
}
export function fileStatus (data) {
  console.log('fileStatus1', data)
}
export function downloadFile () {
  console.log('downloadFile called')
  return (dispatch) => {
    callApi(`backdoor/uploadFile`)
        .then(res => dispatch(fileStatus(res)))
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
