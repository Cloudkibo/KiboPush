import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function imageResponse (data) {
  return {
    type: ActionTypes.SHOW_IMAGE,
    data
  }
}

export function saveMessengerAd (data, msg, handleSaveMessage) {
  console.log('data in saveMessengerAd', data)
  return (dispatch) => {
    callApi('jsonAd', 'post', data)
      .then(res => {
        console.log('response from messengerAds', res)
        if (res.status === 'success') {
          handleSaveMessage(res.payload)
          msg.succes('Message saved successfully')
        } else {
          msg.error('Unable to save message')
        }
      })
  }
}
