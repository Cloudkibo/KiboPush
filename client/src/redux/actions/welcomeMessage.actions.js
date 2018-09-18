/**
 * Created by sojharo on 21/07/2017.
 */
import callApi from '../../utility/api.caller.service'
import {loadMyPagesList} from './pages.actions'
import { removeButtonOldurl } from './actions.utility'

export function isWelcomeMessageEnabled (data) {
  return (dispatch) => {
    callApi(`pages/isWelcomeMessageEnabled/`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadMyPagesList())
        }
      })
  }
}
export function createWelcomeMessage (messageData, msg) {
  console.log('messageData', messageData)
  let data = removeButtonOldurl({payload: messageData.welcomeMessage})
  let dataToSend = {_id: messageData._id, welcomeMessage: data.payload}
  return (dispatch) => {
    callApi(`pages/createWelcomeMessage/`, 'post', dataToSend)
      .then(res => {
        console.log('response from createWelcomeMessage', res)
        if (res.status === 'success') {
          msg.success('Message saved successfully')
        } else {
          msg.error('Message cannot be saved')
        }
      })
  }
}
