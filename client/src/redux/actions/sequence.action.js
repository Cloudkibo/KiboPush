import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllSequence (data) {
  return {
    type: ActionTypes.SHOW_ALL_SEQUENCE,
    sequence: data
  }
}

export function showCreatedSequence (data) {
  return {
    type: ActionTypes.SHOW_CREATED_SEQUENCE,
    data
  }
}

export function createSequence (data) {
  return (dispatch) => {
    callApi('sequenceMessaging/createSequence', 'post', data)
      .then(res => {
        console.log('response from createBot', res)
        if (res.status === 'success') {
          dispatch(showCreatedSequence(res.payload))
        }
      })
  }
}

export function createMessage (data) {
  console.log('data createMessage', data)
  return (dispatch) => {
    callApi('sequenceMessaging/createMessage', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(data.sequenceId))
        }
      })
  }
}

export function setSchedule (data, sequenceId) {
  return (dispatch) => {
    callApi('sequenceMessaging/setSchedule', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(sequenceId))
        }
      })
  }
}

export function setStatus (data, sequenceId) {
  console.log('data', data)
  return (dispatch) => {
    callApi('sequenceMessaging/setStatus', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(sequenceId))
        }
      })
  }
}

export function fetchAllSequence () {
  console.log('fetchAllSequence')
  return (dispatch) => {
    callApi(`sequenceMessaging/allSequences`)
      .then(res => {
        console.log('fetchAllSequence', res)
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

export function fetchAllMessages (id) {
  console.log('fetchAllMessages')
  return (dispatch) => {
    callApi(`sequenceMessaging/allMessages/${id}`)
      .then(res => {
        console.log('res', res)
        if (res.status === 'success') {
          console.log('allMessages', res.payload)
          dispatch(showAllMessages(res.payload))
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

export function deleteMessage (id, msg, sequenceId) {
  return (dispatch) => {
    callApi(`sequenceMessaging/deleteMessage${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(sequenceId))
          msg.success('Message deleted successfully')
        }
      })
  }
}
