import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showautoposting (data) {
  return {
    type: ActionTypes.FETCH_AUTOPOSTING_LIST,
    autoposting: data
  }
}

export function createAutopostingSuccess () {
  return {
    type: ActionTypes.CREATE_AUTOPOSTING_SUCCESS,
    successMessage: 'Changes saved successfully!'
  }
}

export function createAutopostingFailure (message) {
  return {
    type: ActionTypes.CREATE_AUTOPOSTING_FAILURE,
    errorMessage: message
  }
}

export function clearAlertMessages () {
  return {
    type: ActionTypes.CLEAR_AUTOPOSTING_ALERT_MESSAGES
  }
}

export function editAutopostingSuccess () {
  return {
    type: ActionTypes.EDIT_AUTOPOSTING_SUCCESS,
    successMessage: 'Changes saved successfully!'
  }
}

export function editAutopostingFailure (message) {
  return {
    type: ActionTypes.EDIT_AUTOPOSTING_FAILURE,
    errorMessage: message
  }
}

export function showAutopostingMessages (data) {
  // var sorted = data.messages.sort(function (a, b) {
  //   return new Date(b.datetime) - new Date(a.datetime)
  // })
  return {
    type: ActionTypes.FETCH_AUTOPOSTING_MESSAGES_LIST,
    autoposting_messages: data.messages,
    count: data.count
  }
}

export function showAutopostingPosts (data) {
  return {
    type: ActionTypes.SHOW_AUTOPOSTING_POSTS,
    autoposting_posts: data.posts,
    count: data.count
  }
}

export function loadAutopostingList () {
  return (dispatch) => {
    callApi('autoposting').then(res => dispatch(showautoposting(res.payload)))
  }
}

export function createautoposting (data) {
  return (dispatch) => {
    callApi('autoposting/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          dispatch(createAutopostingSuccess())
          dispatch(loadAutopostingList())
        } else {
          dispatch(createAutopostingFailure(res.description))
        }
      })
  }
}

export function deleteautoposting (id) {
  return (dispatch) => {
    callApi(`autoposting/${id}`, 'delete')
      .then(res => dispatch(loadAutopostingList()))
  }
}

export function editautoposting (data) {
  return (dispatch) => {
    callApi('autoposting/edit', 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          dispatch(editAutopostingSuccess())
          dispatch(loadAutopostingList())
        } else {
          dispatch(editAutopostingFailure(res.description))
        }
      })
  }
}

export function loadAutopostingMessages (id, data) {
  console.log('data for loadAutopostingMessages', data)
  return (dispatch) => {
    callApi(`autoposting_messages/getMessages/${id}`, 'post', data)
      .then(res => {
        console.log('response from getMessages', res)
        if (res.status === 'success') {
          dispatch(showAutopostingMessages(res.payload))
        }
      })
  }
}

export function loadAutopostingPosts (id, data) {
  console.log('data for loadAutopostingPosts', data)
  return (dispatch) => {
    callApi(`autoposting_fb_posts/${id}`, 'post', data)
      .then(res => {
        console.log('response from loadAutopostingPosts', res)
        if (res.status === 'success') {
          dispatch(showAutopostingPosts(res.payload))
        }
      })
  }
}
