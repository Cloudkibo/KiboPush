import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

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

export function updatePagesList (data) {
  console.log('Users Created Pages', data)
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
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
    data: data.payload
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
    data: data.payload
  }
}
export function loadPollsList (id) {
  console.log('load Poll called', id)
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
