/**
 * Created by sojharo on 21/07/2017.
 */
import callApi from '../../utility/api.caller.service'
import {loadMyPagesList} from './pages.actions'

export function isWelcomeMessageEnabled (data) {
  console.log('isWelcomeMessageEnabled called')
  return (dispatch) => {
    callApi(`pages/isWelcomeMessageEnabled/`, 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          dispatch(loadMyPagesList())
        }
      })
  }
}
export function createWelcomeMessage (data, msg) {
  return (dispatch) => {
    callApi(`pages/createWelcomeMessage/`, 'post', data)
      .then(res => {
        console.log('Response From Add Pages', res)
        if (res.status === 'success') {
          msg.success('Message saved successfully')
        } else {
          msg.error('Message cannot be saved')
        }
      })
  }
}
