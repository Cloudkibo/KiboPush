import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllSequence (data) {
  return {
    type: ActionTypes.SHOW_ALL_SEQUENCE,
    sequence: data
  }
}

export function showSubscriberSequence (data) {
  return {
    type: ActionTypes.SHOW_SUBSCRIBER_SEQUENCE,
    subscriberSequences: data
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

export function getSubscriberSequences (subscriberId) {
  return (dispatch) => {
    callApi(`sequenceMessaging/subscriberSequences/${subscriberId}`)
      .then(res => {
        if (res.status === 'success') {
          console.log('subscriberSequences', res.payload)
          dispatch(showSubscriberSequence(res.payload))
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
          msg.success('Subscriber(s) have been subscribed successfully!')
        } else {
          console.log(res.description)
          msg.error('Failed to subscribe to sequence!')
        }
      })
  }
}

export function unsubscribeToSequence (data, msg) {
  return (dispatch) => {
    callApi(`sequenceMessaging/unsubscribeToSequence`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Subscriber(s) have been unsubscribed successfully!')
          dispatch(getSubscriberSequences(data.subscriberIds[0]))
        } else {
          msg.error('Failed to unsubscribe to sequence!')
        }
      })
  }
}

export function saveMessageSeq (data, msg) {
  return (dispatch) => {
    callApi('sequenceMessaging/createMessage', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Message saved successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function deleteSequence (id, msg) {
  return (dispatch) => {
    callApi(`sequenceMessaging/deleteSequence/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Sequence deleted successfully')
          dispatch(fetchAllSequence())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete Sequence. ${res.description}`)
          } else {
            msg.error('Failed to delete Sequence')
          }
        }
      })
  }
}
