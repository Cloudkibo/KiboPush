import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'
export const API_URL = '/api'

export function showContacts (data) {
  return {
    type: ActionTypes.LOAD_CONTACTS_LIST,
    contacts: data.contacts,
    count: data.count
  }
}

export function uploadFile (filedata, msg, clearFields) {
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
      if (res.status === 'success') {
        msg.success('Contacts saved successfully')
        dispatch(clearFields())
      }
    })
  }
}

export function uploadNumbers (data, msg, clearFields) {
  return (dispatch) => {
    callApi('contacts/uploadNumbers', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('Response', res)
          msg.success('Contacts saved successfully')
          dispatch(clearFields())
        }
      }
    )
  }
}

export function loadContactsList (data) {
  console.log('data for loadContactsList', data)
  return (dispatch) => {
    callApi('contacts', 'post', data)
      .then(res => {
        console.log('response from loadContactsList', res)
        dispatch(showContacts(res.payload))
      })
  }
}
