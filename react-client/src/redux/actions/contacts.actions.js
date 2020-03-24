import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

function addContact (data) {
  return {
    type: ActionTypes.ADD_CONTACT,
    data
  }
}

function editContact (data) {
  return {
    type: ActionTypes.EDIT_CONTACT,
    data
  }
}

export function deleteContact (data) {
  return {
    type: ActionTypes.DELETE_CONTACT,
    data
  }
}

export function deleteAllInvalidContacts (data) {
  return {
    type: ActionTypes.DELETE_ALL_INVALID_CONTACTS
  }
}

export function deleteAllContacts (data) {
  return {
    type: ActionTypes.DELETE_ALL_CONTACTS
  }
}

export function saveContacts (data) {
  return {
    type: ActionTypes.SAVE_CONTACTS,
    data
  }
}

export function addContactManually (name, number, callback) {
  return (dispatch) => {
    callApi('twilio/verify', 'post', {number})
      .then(res => {
        console.log('response from addContactManually', res)
        if (res.status === 'success') {
          dispatch(addContact({name, number, status: 'Valid'}))
        }
        callback(res)
      })
  }
}

export function updateContact (data, callback) {
  return (dispatch) => {
    callApi('twilio/verify', 'post', {number: data.number})
      .then(res => {
        console.log('response from updateContact', res)
        if (res.status === 'success') {
          data.status = 'Valid'
          dispatch(editContact(data))
        }
        callback(res)
      })
  }
}

export function uploadFile (filedata, callback) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/contacts/uploadFile`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response from uploadFile', res)
      callback(res)
    })
  }
}
