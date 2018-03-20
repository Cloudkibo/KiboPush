/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import {loadMyPagesList} from './pages.actions'

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
export function createWelcomeMessage (data, msg) {
  return (dispatch) => {
    callApi(`pages/createWelcomeMessage/`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Message saved successfully')
        } else {
          msg.error('Message cannot be saved')
        }
      })
  }
}
