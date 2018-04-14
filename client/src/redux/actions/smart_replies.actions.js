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

export function showBotDetails (data) {
  return {
    type: ActionTypes.SHOW_BOT_DETAILS,
    data
  }
}

export function loadBotsList () {
  return (dispatch) => {
    callApi('bots')
      .then(res => {
        if (res.status === 'success') {
          console.log("List the sequence of bots". res.payload)
          dispatch(showBotsList(res.payload))
        }else{
          console.log("Something went wrong in fetching bots", res)
        }
      }).catch((err) => {
        console.log("In catch cant process bot list", err)
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

export function deleteBot (id, msg) {
  return (dispatch) => {
    callApi(`bots/delete/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Bot deleted successfully')
          dispatch(loadBotsList())
        }
      })
  }
}

export function botDetails (id) {
  return (dispatch) => {
    callApi(`bots/botDetails/${id}`)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showBotDetails(res.payload))
        }
      })
  }
}
