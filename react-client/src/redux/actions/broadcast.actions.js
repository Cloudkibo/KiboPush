import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
import { removeButtonOldurl } from './actions.utility'
export const API_URL = '/api'

export function deleteFiles (data) {
  let files = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].componentType === 'file') {
      files.push(data[i].fileurl.name)
    }
  }
  if (files.length > 0) {
    return (dispatch) => {
      callApi('broadcasts/deleteFiles', 'post', files)
        .then(res => {
          console.log(res.payload)
        })
    }
  }
}

export function appendSentSeenData (data) {
  // we will have broadcast and page_broadcast_pages
  let broadcasts = data.broadcasts
  let pagebroadcasts = data.broadcastpages

  for (let j = 0; j < broadcasts.length; j++) {
    let pagebroadcast = pagebroadcasts.filter((c) => c.broadcastId === broadcasts[j]._id)
    let pageBroadcastDelivered = pagebroadcast.filter((c) => c.sent === true)
    let pagebroadcastTapped = pagebroadcast.filter((c) => c.seen === true)
    broadcasts[j].sent = pageBroadcastDelivered.length// total sent
    broadcasts[j].seen = pagebroadcastTapped.length // total tapped
  }
  return broadcasts
}

export function showbroadcasts (data) {
  return {
    type: ActionTypes.FETCH_BROADCASTS_LIST,
    broadcasts: appendSentSeenData(data),
    count: data.count
  }
}

export function updatefileuploadStatus (status) {
  return {
    showFileUploading: status,
    type: ActionTypes.SHOW_FILE_UPLOAD_INDICATOR
  }
}

export function addBroadcast (data) {
  // here we will add the broadcast
  return {
    type: ActionTypes.ADD_BROADCAST,
    data
  }
}
export function getbroadcast (data) {
  return {
    type: ActionTypes.GET_BROADCAST,
    data
  }
}

export function editBroadcast (data) {
  // here we will edit the broadcast
  return {
    type: ActionTypes.EDIT_BROADCAST,
    data
  }
}

export function sendBroadcastSuccess () {
  return {
    type: ActionTypes.SEND_BROADCAST_SUCCESS
  }
}

export function sendBroadcastFailure () {
  return {
    type: ActionTypes.SEND_BROADCAST_FAILURE
  }
}

export function clearAlertMessage () {
  return {
    type: ActionTypes.CLEAR_ALERT
  }
}

export function loadBroadcastsList (days) {
  return (dispatch) => {
    callApi(`broadcasts/all/${days}`).then(res => dispatch(showbroadcasts(res.payload)))
  }
}

export function allBroadcasts (broadcast) {
  console.log('broadcast', broadcast)
  return (dispatch) => {
    callApi('broadcasts/allBroadcasts', 'post', broadcast)
      .then(res => {
        if (res.status === 'success') {
          console.log('allBroadcasts', res.payload)
          dispatch(showbroadcasts(res.payload))
        } else {
          console.log('error', res)
        }
      })
  }
}

export function createbroadcast (broadcast) {
  return (dispatch) => {
    callApi('broadcasts/create', 'post', broadcast)
      .then(res => {
        if (res.status === 'success') {
          dispatch(sendBroadcastSuccess())
        } else {
          dispatch(sendBroadcastFailure())
        }
        //  dispatch(loadBroadcastsList())
      })
  }
}

export function deletefile (data) {
  return (dispatch) => {
    callApi('broadcasts/deletefile', 'post', data)
      .then(res => dispatch(addBroadcast(data)))
  }
}
export function uploadBroadcastfile (filedata) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/uploadfile`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(deletefile(res.payload)))
  }
}

export function editbroadcast (broadcast) {
  return (dispatch) => {
    callApi('broadcasts/edit', 'post', {broadcast: broadcast})
      .then(res => {
        //  dispatch(loadBroadcastsList())
      })
  }
}

export function sendbroadcast (broadcast) {
  console.log('sendbroadcast', broadcast)
  return (dispatch) => {
    callApi('broadcasts/send', 'post', broadcast).then(res => {
      if (res.status === 'success') {
        dispatch(sendBroadcastSuccess())
      } else {
        dispatch(sendBroadcastFailure())
      }
    })
  }
}

export function downloadFile (broadcast) {
  return (dispatch) => {
    callApi(`broadcasts/downloadfile/${broadcast._id}`).then(res => {
      // dispatch(editBroadcast(res.payload));
    })
  }
}

export function uploadRequest (data) {
  return (dispatch) => {
    callApi(`broadcasts/upload`, 'post', data).then(res => {
        // dispatch(editBroadcast(res.payload));
      console.log('Upload Action Response', res)
      if (res.status === 'success') {
      } else {
      }
    })
  }
}

export function addButton (data, handleFunction, msg, resetButton) {
  console.log('the data is', data)
  return (dispatch) => {
    callApi(`broadcasts/addButton`, 'post', data).then(res => {
      if (res.status === 'success') {
        console.log('Response: ', res.payload)
        handleFunction(res.payload)
        if (resetButton) {
          resetButton()
        }
      } else {
        console.log(res.payload)
        if (msg) {
          if (res.payload) {
            msg.error(res.payload)
          }
          if (res.description) {
            msg.error(res.description)
          }
        }
      }
    })
  }
}

export function editButton (data, handleFunction, handleClose, msg) {
  return (dispatch) => {
    callApi(`broadcasts/editButton`, 'post', data).then(res => {
      if (res.status === 'success') {
        handleFunction(res.payload)
        if (handleClose) {
          handleClose()
        }
      } else {
        console.log(res.payload)
        if (msg) {
          if (res.payload) {
            msg.error(res.payload)
          }
          if (res.description) {
            msg.error(res.description)
          }
        }
      }
    })
  }
}

export function deleteButton (id) {
  return (dispatch) => {
    callApi(`broadcasts/deleteButton/${id}`, 'delete').then(res => {
      console.log(res.description)
    })
  }
}

export function sendBroadcast (broadcastData, msg, handleSendBroadcast) {
  let data = removeButtonOldurl(broadcastData)
  return (dispatch) => {
    callApi('broadcasts/sendConversation', 'post', data)
      .then(res => {
        console.log('Response got from sendConversation', res)
        if (msg) {
          if (res.status === 'success') {
            msg.success('Conversation successfully sent')
            // dispatch(sendBroadcastSuccess())
          } else if (res.status !== 'INVALID_SESSION') {
            if (res.description) {
              msg.error(`${res.description}`)
            } else {
              msg.error('Failed to send conversation')
            }
            // dispatch(sendBroadcastFailure())
          }
        } else {
          if (res.status === 'success') {
            dispatch(sendBroadcastSuccess())
          } else {
            dispatch(sendBroadcastFailure())
          }
        }
        if (handleSendBroadcast) {
          handleSendBroadcast(res)
        }
      })
  }
}
export function checkWhitelistedDomains (data, handleFunction, url) {
  console.log('the data is', data)
  return (dispatch) => {
    callApi(`pages/isWhitelisted`, 'post', data).then(res => {
      handleFunction(res, url)
    })
  }
}

export function getSubscriberCount (data, callback) {
  console.log('data in getSubscriberCount', data)
  return(dispatch) => {
    callApi('broadcasts/retrieveSubscribersCount', 'post', data)
    .then(res => {
      console.log(res)
      callback(res)
    })
  }
}
