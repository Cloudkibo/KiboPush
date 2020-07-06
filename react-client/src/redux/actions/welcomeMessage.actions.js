/**
 * Created by sojharo on 21/07/2017.
 */
import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'
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

export function saveWelcomeMessage (data) {
  return {
    type: ActionTypes.SAVE_WELCOME_MESSAGE,
    data
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
          dispatch(saveWelcomeMessage(messageData))
          msg.success('Message saved successfully')
        } else {
          msg.error('Message cannot be saved')
        }
      })
  }
}
