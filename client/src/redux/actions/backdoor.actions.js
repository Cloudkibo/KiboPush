import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateUsersList (data) {
  console.log('Data Fetched From Users', data)
  return {
    type: ActionTypes.LOAD_USERS_LIST,
    data
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
    data
  }
}

export function loadPagesList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadPagesList called')
  return (dispatch) => {
    callApi('backdoor/allpages').then(res => dispatch(updatePagesList(res)))
  }
}
