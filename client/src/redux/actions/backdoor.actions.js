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

export function loadPagesList () {
  // here we will fetch list of user pages from endpoint
  console.log('loadPagesList called')
  return (dispatch) => {
    callApi('backdoor/allpages').then(res => dispatch(updatePagesList(res)))
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
