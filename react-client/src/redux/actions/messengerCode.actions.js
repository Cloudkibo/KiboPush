import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showUpdatedData (data) {
  return {
    type: ActionTypes.UPDATE_MESSENGER_CODE,
    data
  }
}

export function showAllCodes (data) {
  return {
    type: ActionTypes.SHOW_MESSENGER_CODES,
    data
  }
}

export function resetState () {
  return {
    type: ActionTypes.RESET_STATE_MSG_CODE
  }
}

export function fetchCodes () {
  return (dispatch) => {
    callApi('messenger_code').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showAllCodes(res.payload))
      }
    })
  }
}

export function deleteCode (id, msg) {
  return (dispatch) => {
    callApi(`messenger_code/${id}`, 'delete').then(res => {
      if (res.status === 'success') {
        msg.success('Messenger Ref URL has been deleted')
        dispatch(fetchCodes())
      } else {
        msg.error(res.description || 'Failed to delete Messenger Ref URL')
      }
    })
  }
}

export function createCode (data, msg) {
  return (dispatch) => {
    if (data.newFiles) {
      delete data.newFiles
    }
    callApi('messenger_code', 'post', data)
    .then(res => {
       if (res.status === 'success') {
         msg.success('Messenger Code saved successfully')
       } else if (res.status !== 'success' && res.payload) {
         msg.error(res.payload)
       } else {
         msg.error(res.description || 'Failed to save Messenger Code')
       }
     })
   }
}


export function requestMessengerCode (messengerCode) {
  return (dispatch) => {
    callApi('messenger_code/getQRCode/'+messengerCode.page_id, 'get')
      .then(res => {
        if (res.status === 'success') {
          messengerCode.QRCode = res.payload
          dispatch(updateData(messengerCode, messengerCode))
        }
      })
  }
}

export function updateData (messengerCodeData, edit) {
  return (dispatch) => {
      messengerCodeData = {
        pageId: edit.pageId,
        optInMessage: edit.optInMessage,
        QRCode: edit.QRCode,
        _id: edit._id && edit._id,
        newFiles: edit.newFiles
      }
    dispatch(showUpdatedData(messengerCodeData))
  }
}

export function editCode (data, msg) {
  return (dispatch) => {
    if (data.newFiles) {
      delete data.newFiles
    }
    callApi('messenger_code/edit/'+data.pageId, 'post', data)
    .then(res => {
      if (res.status === 'success') {
        msg.success('Messenger Code saved successfully')
      } else if (res.status !== 'success' && res.payload) {
        msg.error(res.payload)
      } else {
        msg.error(res.description || 'Failed to save Messenger Code')
      }
    })
  }
}
