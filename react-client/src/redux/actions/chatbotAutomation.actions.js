import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

function showChatbots (data) {
  return {
    type: ActionTypes.SHOW_CHATBOTS,
    data
  }
}

export function fetchChatbots () {
  return (dispatch) => {
    callApi('chatbots')
      .then(res => {
        console.log('response from fetchChatbots', res)
        if (res.status === 'success') {
          dispatch(showChatbots(res.payload))
        }
      })
  }
}

export function createChatbot (data, callback) {
  return (dispatch) => {
    callApi('chatbots', 'post', data)
      .then(res => {
        console.log('response from createChatbot', res)
        callback(res)
      })
  }
}
