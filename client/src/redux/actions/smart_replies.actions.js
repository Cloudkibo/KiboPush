import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showBotsList (data) {
  return {
    type: ActionTypes.SHOW_BOTS,
    data
  }
}

export function showCreatedBot (data) {
  return {
    type: ActionTypes.SHOW_CREATED_BOT,
    data
  }
}

export function loadBotsList () {
  return (dispatch) => {
    callApi('bots')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showBotsList(res.payload))
        }
      })
  }
}

export function createBot (data) {
  return (dispatch) => {
    callApi('bots/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showCreatedBot(res.payload))
        }
      })
  }
}
