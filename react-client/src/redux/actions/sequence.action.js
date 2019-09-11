import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllSequence (data) {
  return {
    type: ActionTypes.SHOW_ALL_SEQUENCE,
    sequence: data
  }
}

export function showAllSequenceNew (data) {
  return {
    type: ActionTypes.SHOW_ALL_SEQUENCE_NEW,
    sequence: data.sequences,
    count: data.count
  }
}

export function showSubscriberSequence (data) {
  return {
    type: ActionTypes.SHOW_SUBSCRIBER_SEQUENCE,
    subscriberSequences: data
  }
}

export function showCreatedSequence (data) {
  return {
    type: ActionTypes.SHOW_CREATED_SEQUENCE,
    data
  }
}

export function createSequence (data, msg) {
  return (dispatch) => {
    callApi('sequenceMessaging/createSequence', 'post', data)
      .then(res => {
        console.log('response from createBot', res)
        if (res.status === 'success') {
          dispatch(showCreatedSequence(res.payload))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function updateSegmentation (data, msg) {
  console.log('updateSegmentation data', data)
  return (dispatch) => {
    callApi('sequenceMessaging/updateSegmentation', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(data.sequenceId))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function createMessage (data, browserHistory, msg, sequenceName) {
  console.log('data createMessage', data)
  return (dispatch) => {
    callApi('sequenceMessaging/createMessage', 'post', data)
      .then(res => {
        console.log('response from createMessage', res)
        if (res.status === 'success') {
          dispatch(fetchAllMessages(data.sequenceId))
          browserHistory.push({
            pathname: '/editSequence',
            state: {module: 'view', _id: data.sequenceId, name: sequenceName}
          })
        } else {
          msg.error('Failed to create message')
        }
      })
  }
}

export function setSchedule (data) {
  return (dispatch) => {
    callApi('sequenceMessaging/setSchedule', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(fetchAllMessages(data.sequenceId))
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

export function editMessage (data, msg) {
  console.log('data', data)
  return (dispatch) => {
    callApi('sequenceMessaging/editMessage', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Message saved successfully')
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

export function fetchAllSequenceNew (data) {
  console.log('data', data)
  return (dispatch) => {
    callApi(`sequenceMessaging/getAll`, 'post', data)
      .then(res => {
        console.log('fetchAllSequence', res)
        if (res.status === 'success') {
          console.log('allSequences', res.payload)
          dispatch(showAllSequenceNew(res.payload))
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

export function subscribeToSequence (data, msg, handleSeqResponse) {
  return (dispatch) => {
    callApi(`sequenceMessaging/subscribeToSequence`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Subscriber(s) have been subscribed successfully!')
        } else {
          console.log(res.description)
          msg.error('Failed to subscribe to sequence!')
        }
        if (handleSeqResponse) {
          handleSeqResponse(res)
        }
      })
  }
}

export function unsubscribeToSequence (data, msg, handleSeqResponse) {
  return (dispatch) => {
    callApi(`sequenceMessaging/unsubscribeToSequence`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Subscriber(s) have been unsubscribed successfully!')
          dispatch(getSubscriberSequences(data.subscriberIds[0]))
        } else {
          msg.error('Failed to unsubscribe to sequence!')
        }
        if (handleSeqResponse) {
          handleSeqResponse(res)
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

export function deleteSequence (id, msg) {
  console.log('id', id)
  return (dispatch) => {
    callApi(`sequenceMessaging/deleteSequence/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          if (msg) msg.success('Sequence deleted successfully')
          dispatch(fetchAllSequence())
        } else {
          if (res.status === 'failed' && res.description) {
            if (msg) msg.error(`Failed to delete Sequence. ${res.description}`)
          } else {
            if (msg) msg.error('Failed to delete Sequence')
          }
        }
      })
  }
}

export function deleteMessage (id, msg, seqId) {
  return (dispatch) => {
    callApi(`sequenceMessaging/deleteMessage/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Sequence deleted successfully')
          dispatch(fetchAllMessages(seqId))
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete Message. ${res.description}`)
          } else {
            msg.error('Failed to delete Message')
          }
        }
      })
  }
}

export function updateTrigger (data, msg) {
  return (dispatch) => {
    callApi('sequenceMessaging/updateTrigger', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Trigger Updated Successfully')
        } else {
          if (res.status === 'failed' && res.description) {
            console.log('error in updating sequence trigger' + res.description)
            msg.error(`Failed to delete Message. ${res.description}`)
          }
        }
      })
  }
}
