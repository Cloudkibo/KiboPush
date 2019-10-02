import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showUpdatedData (data) {
  return {
    type: ActionTypes.UPDATE_MESSENGER_CODE,
    data
  }
}

export function showAllURLs (data) {
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
  console.log('in fetchCodes')
  // return (dispatch) => {
  //   callApi('pageReferrals').then(res => {
  //     console.log('response from fetchURLs', res)
  //     if (res.status === 'success' && res.payload) {
  //       dispatch(showAllURLs(res.payload))
  //     }
  //   })
  // }
}

export function deleteCode (id, msg) {
  // return (dispatch) => {
  //   callApi(`pageReferrals/${id}`, 'delete').then(res => {
  //     console.log('response from deleteURL', res)
  //     if (res.status === 'success') {
  //       msg.success('Messenger Ref URL has been deleted')
  //       dispatch(fetchURLs())
  //     } else {
  //       msg.error('Failed to delete Messenger Ref URL')
  //     }
  //   })
  // }
}


export function requestMessengerCode (messengerCode) {
  return (dispatch) => {
    callApi('messenger_code/getQRCode/'+messengerCode.pageId, 'get')
      .then(res => {
        console.log('response from requestMessengerCode', res)
        if (res.status === 'success') {
          messengerCode.QRCode = res.payload
          dispatch(updateData(messengerCode, messengerCode))
        }
      })
  }
}

export function updateData (messengerCodeData, edit) {
  return (dispatch) => {
    console.log('messengerRefURLData', messengerCodeData)
      console.log('edit', edit)
      messengerCodeData = {
        pageId: edit.pageId,
        optInMessage: edit.optInMessage,
        QRCode: edit.QRCode
      }
   
    dispatch(showUpdatedData(messengerCodeData))
  }
}



export function createCode (data, msg) {
  console.log('date for createMessengerCode', data)
  // return (dispatch) => {
  //   callApi('pageReferrals', 'post', data)
  //   .then(res => {
  //     console.log('response from createMessengerRefURL', res)
  //     if (res.status === 'success') {
  //       msg.success('Messenger Ref URL saved successfully')
  //     } else if (res.status !== 'success' && res.payload) {
  //       msg.error(res.payload)
  //     } else {
  //       msg.error('Failed to save Messenger Ref URL')
  //     }
  //   })
  // }
}

export function editCode (data, msg) {
  console.log('data for editCode', data)
  // return (dispatch) => {
  //   callApi(`pageReferrals/edit`, 'post', data)
  //   .then(res => {
  //     console.log('response from editURL', res)
  //     if (res.status === 'success') {
  //       msg.success('Messenger Ref URL saved successfully')
  //     } else if (res.status !== 'success' && res.payload) {
  //       msg.error(res.payload)
  //     } else {
  //       msg.error('Failed to save Messenger Ref URL')
  //     }
  //   })
  // }
}