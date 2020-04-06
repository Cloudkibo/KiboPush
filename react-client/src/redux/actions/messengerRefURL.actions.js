import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showUpdatedData (data) {
  return {
    type: ActionTypes.UPDATE_MESSENGER_REF_URL,
    data
  }
}

export function showAllURLs (data) {
  return {
    type: ActionTypes.SHOW_MESSENGER_REF_URLS,
    data
  }
}

export function resetState () {
  return {
    type: ActionTypes.RESET_STATE_REF_URL
  }
}

export function fetchURLs () {
  console.log('in fetchURLs')
  return (dispatch) => {
    callApi('pageReferrals').then(res => {
      console.log('response from fetchURLs', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllURLs(res.payload))
      }
    })
  }
}
export function deleteURL (id, msg) {
  return (dispatch) => {
    callApi(`pageReferrals/${id}`, 'delete').then(res => {
      console.log('response from deleteURL', res)
      if (res.status === 'success') {
        msg.success('Messenger Ref URL has been deleted')
        dispatch(fetchURLs())
      } else {
        msg.error('Failed to delete Messenger Ref URL')
      }
    })
  }
}
export function updateData (messengerRefURLData, updateKey, updateValue, edit) {
  return (dispatch) => {
    console.log('messengerRefURLData', messengerRefURLData)
    console.log('updateKey', updateKey)
    console.log('updateValue', updateValue)
    if (edit) {
      console.log('edit', edit)
      messengerRefURLData = {
        pageId: edit.pageId,
        ref_parameter: edit.ref_parameter,
        reply: edit.reply,
        sequenceId: edit.sequenceId,
        newFiles: edit.newFiles
      }
     // messengerRefURLData[updateKey] = updateValue
    } else {
      messengerRefURLData[updateKey] = updateValue
    }
    dispatch(showUpdatedData(messengerRefURLData))
  }
}

export function createURL (data, msg) {
  console.log('date for createMessengerRefURL', data)
  return (dispatch) => {
    callApi('pageReferrals', 'post', data)
    .then(res => {
      console.log('response from createMessengerRefURL', res)
      if (res.status === 'success') {
        msg.success('Messenger Ref URL saved successfully')
      } else if (res.status !== 'success' && res.payload) {
        msg.error(res.payload)
      } else {
        msg.error('Failed to save Messenger Ref URL')
      }
    })
  }
}

export function editURL (data, msg) {
  console.log('data for editURL', data)
  return (dispatch) => {
    callApi(`pageReferrals/edit`, 'post', data)
    .then(res => {
      console.log('response from editURL', res)
      if (res.status === 'success') {
        msg.success('Messenger Ref URL saved successfully')
      } else if (res.status !== 'success' && res.payload) {
        msg.error(res.payload)
      } else {
        msg.error('Failed to save Messenger Ref URL')
      }
    })
  }
}
