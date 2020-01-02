import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateChat (data) {
  return {
    type: ActionTypes.UPDATE_DEMOSSA_CHAT,
    data
  }
}

export function getResponse (body) {
  return (dispatch) => {
    callApi('https://www.synaps3webrtc.com/webPost', 'post', body, 'demoSSA')
      .then(res => {
        console.log('demoSSA response', res)
        if (res.answer) {
          dispatch(updateChat(res.answer))
        } else console.log('could not get response from glitch')
      })
  }
}
