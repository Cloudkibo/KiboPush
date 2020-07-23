import * as ActionTypes from '../constants/constants'
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

export function addContactManually (name, number, callback) {
  return (dispatch) => {
    dispatch(addContact({name, number, status: 'Valid'}))
    callback({status: 'success'})
  }
}
export function updateContact (data, callback) {
  return (dispatch) => {
    data.status = 'Valid'
    dispatch(editContact(data))
    callback({status: 'success'})
  }
}
export function getDuplicateSubscribers (filedata, callback) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/whatsAppContacts/getDuplicateSubscribers`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response from getDuplicateSubscribers', res)
      callback(res)
    })
  }
}
