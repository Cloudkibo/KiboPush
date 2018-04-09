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
  console.log('createBot data', data)
  return (dispatch) => {
    callApi('bots/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showCreatedBot(res.payload))
        }
      })
  }
}

export function editBot (data) {
  return (dispatch) => {
    callApi('bots/edit', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadBotsList())
        }
      })
  }
}

export function updateStatus (data) {
  return (dispatch) => {
    callApi('bots/updateStatus', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadBotsList())
        }
      })
  }
}
