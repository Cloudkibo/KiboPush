import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function imageResponse (data) {
  return {
    type: ActionTypes.SHOW_IMAGE,
    data
  }
}

export function resetState () {
  return {
    type: ActionTypes.RESET_STATE_MSG_CODE
  }
}

export function requestMessengerCode (pageId) {
  console.log('data in requestMessengerCode', pageId)
  return (dispatch) => {
    callApi('messenger_code/getQRCode/'+pageId, 'get')
      .then(res => {
        console.log('response from requestMessengerCode', res)
        if (res.status === 'success') {
          dispatch(imageResponse(res.payload.uri))
        }
      })
  }
}
