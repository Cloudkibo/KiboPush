import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllSequence (data) {
  return {
    type: ActionTypes.SHOW_ALL_SEQUENCE,
    sequence: data
  }
}

export function fetchAllSequence () {
  console.log('fetchAllSequence')
  return (dispatch) => {
    callApi(`allSequences`)
      .then(res => {
        if (res.status === 'success') {
          console.log('allSequences', res.payload)
          dispatch(showAllSequence(res.payload))
        }
      })
  }
}

export function showAllMessages (data) {
  return {
    type: ActionTypes.SHOW_ALL_MESSAGES,
    messages: data
  }
}

export function fetchAllMessages () {
  console.log('fetchAllMessages')
  return (dispatch) => {
    callApi(`/allMessages`)
      .then(res => {
        if (res.status === 'success') {
          console.log('allMessages', res.payload)
          dispatch(showAllSequence(res.payload))
        }
      })
  }
}
