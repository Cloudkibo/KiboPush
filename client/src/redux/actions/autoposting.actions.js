import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showautoposting (data) {
  console.log('showautoposting')
  console.log(data)
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

export function loadAutopostingList () {
  return (dispatch) => {
    callApi('autoposting').then(res => dispatch(showautoposting(res.payload)))
  }
}

export function createautoposting (data) {
  console.log(data)
  return (dispatch) => {
    callApi('autoposting/create', 'post', data)
      .then(res => {
        console.log(res)
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
    callApi(`autoposting/:${id}`, 'delete')
      .then(res => dispatch(loadAutopostingList()))
  }
}

export function editautoposting (data) {
  console.log(data)
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
