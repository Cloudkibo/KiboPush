import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
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
    let filterBySubscriber = []
    pagebroadcast.map((c, i) => {
      if (c.broadcastId === broadcasts[j]._id) {
        for (var index = 0; index < filterBySubscriber.length; index++) {
          if (c.subscriberId === filterBySubscriber[index].subscriberId) {
            break
          }
        }
        if (index === filterBySubscriber.length) {
          filterBySubscriber.push(c)
        }
      }
    })
    broadcasts[j].sent = filterBySubscriber.length// total sent
    let pagebroadcastTapped = filterBySubscriber.filter((c) => c.seen === true)
    broadcasts[j].seen = pagebroadcastTapped.length // total tapped
  }
  //  var newBroadcast = broadcasts.reverse()
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

export function sendBroadcast (data, msg, handleSendBroadcast) {
  return (dispatch) => {
    callApi('broadcasts/sendConversation', 'post', data)
      .then(res => {
        console.log('Response got from sendConversation', res)
        if (msg) {
          if (res.status === 'success') {
            msg.success('Conversation successfully sent')
            // dispatch(sendBroadcastSuccess())
          } else {
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
        handleSendBroadcast(res)
        //  dispatch(loadBroadcastsList())
      })
  }
}
