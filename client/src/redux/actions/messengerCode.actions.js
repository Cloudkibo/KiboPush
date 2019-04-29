import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function imageResponse (data) {
  return {
    type: ActionTypes.SHOW_IMAGE,
    data
  }
}

export function requestMessengerCode (data) {
  console.log('data in requestMessengerCode', data)
  return (dispatch) => {
    callApi('messenger_code', 'post', data)
      .then(res => {
        console.log('response from requestMessengerCode', res)
        if (res.status === 'success') {
          dispatch(imageResponse(res.payload.uri))
        }
      })
  }
}
