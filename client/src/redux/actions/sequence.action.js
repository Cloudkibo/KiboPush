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
    callApi(`sequenceMessaging/allSequences`)
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
    callApi(`sequenceMessaging/allMessages`)
      .then(res => {
        if (res.status === 'success') {
          console.log('allMessages', res.payload)
          dispatch(showAllSequence(res.payload))
        }
      })
  }
}

export function subscribeToSequence (data, msg) {
  return (dispatch) => {
    callApi(`sequenceMessaging/subscribeToSequence`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          this.msg.success('Subscriber(s) have been subscribed successfully!')
        } else {
          this.msg.erro('Failed to subscribe to sequence!')
        }
      })
  }
}

export function unsubscribeToSequence (data, msg) {
  return (dispatch) => {
    callApi(`sequenceMessaging/unsubscribeToSequence`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          this.msg.success('Subscriber(s) have been unsubscribed successfully!')
        } else {
          this.msg.erro('Failed to unsubscribe to sequence!')
        }
      })
  }
}

export function saveMessageSeq (data, msg) {
  return (dispatch) => {
    callApi('createMessage', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Message saved successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}
