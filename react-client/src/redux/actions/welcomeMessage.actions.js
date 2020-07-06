/**
 * Created by sojharo on 21/07/2017.
 */
import callApi from '../../utility/api.caller.service'
import {loadMyPagesList} from './pages.actions'

export function isWelcomeMessageEnabled (data, cb) {
  return (dispatch) => {
    callApi(`pages/isWelcomeMessageEnabled/`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadMyPagesList())
          if(cb) {
            cb(data.isWelcomeMessageEnabled)
          }
        }
      })
  }
}
export function createWelcomeMessage (messageData, msg) {
  console.log('messageData', messageData)
  // let dataToSend = {_id: messageData._id, welcomeMessage: messageData.welcomeMessage}
  return (dispatch) => {
    callApi(`pages/createWelcomeMessage/`, 'post', messageData)
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
