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

export function updateContact (id, data) {
  return {
    type: ActionTypes.UPDATE_CONTACT,
    id,
    data
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
        } else {
          msg.error(res.description)
        }
      }
    )
  }
}

export function syncContacts (data, msg) {
  console.log('data for fetchValidCallerIds', data)
  return (dispatch) => {
    callApi('company/fetchValidCallerIds', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Contacts synced successfully')
          dispatch(loadContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'}))
        } else {
          let errorMsg = res.description || 'Unable to fetch contacts from Twilio'
          msg.error(errorMsg)
        }
      })
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
export function loadWhatsAppContactsList (data, prepareExport) {
  console.log('data for loadWhatsAppContactsList', data)
  return (dispatch) => {
    callApi('whatsAppContacts', 'post', data)
      .then(res => {
        console.log('response from loadWhatsAppContactsList', res)
        dispatch(showContacts(res.payload))
        if (prepareExport) {
          prepareExport(res)
        }
      })
  }
}


export function editSubscriberSms (id, data, msg) {
  console.log('data for editSubscriberSms', data)
  return (dispatch) => {
    callApi(`contacts/update/${id}`, 'post', data)
      .then(res => {
        console.log('response from editSubscriberSms', res)
        if (res.status === 'success') {
          msg.success('Subscriber updated successfully')
          dispatch(updateContact(id, data))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function editSubscriberWhatsApp (id, data,msg) {
  console.log('data for editSubscriber', data)
  return (dispatch) => {
    callApi(`whatsAppContacts/update/${id}`, 'post', data)
      .then(res => {
        console.log('response from editSubscriber', res)
        if (res.status === 'success') {
          msg.success('Subscriber updated successfully')
          dispatch(updateContact(id, data))
          // loadSubscribers()
          //dispatch(loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'}))
        } else {
          msg.error(res.description || 'Unable to update subscriber')
        }
      })
  }
}
