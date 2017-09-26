import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function showbroadcasts (data) {
  // we will have broadcast and page_broadcast_pages
  console.log('showbroadcasts')
  console.log(data)
  let broadcasts = data.broadcasts
  let pagebroadcasts = data.broadcastpages

  for (let j = 0; j < broadcasts.length; j++) {
    let pagebroadcast = pagebroadcasts.filter((c) => c.broadcastId === broadcasts[j]._id)
    broadcasts[j].sent = pagebroadcast.length// total sent
    let pagebroadcastTapped = pagebroadcast.filter((c) => c.seen === true)
    broadcasts[j].seen = pagebroadcastTapped.length // total tapped
    console.log('updated broadcast')
    console.log(broadcasts[j])
  }
  var newBroadcast = broadcasts.reverse()
  return {
    type: ActionTypes.FETCH_BROADCASTS_LIST,
    broadcasts: newBroadcast
  }
}
export function loadBroadcastsList () {
  console.log('Loading broadcast list')
  return (dispatch) => {
    callApi('broadcasts').then(res => dispatch(showbroadcasts(res.payload)))
  }
}

export function createbroadcast (broadcast) {
  console.log('Creating broadcast message')
  console.log(broadcast)
  return (dispatch) => {
    callApi('broadcasts/create', 'post', broadcast)
      .then(res => {
        if (res.status === 'success') {
          dispatch(sendBroadcastSuccess())
        } else {
          dispatch(sendBroadcastFailure())
        }
        dispatch(loadBroadcastsList())
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
  console.log('Uploading broadcast file')
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
export function updatefileuploadStatus (status) {
  return {
    showFileUploading: status,
    type: ActionTypes.SHOW_FILE_UPLOAD_INDICATOR
  }
}

export function addBroadcast (data) {
  // here we will add the broadcast
  console.log(data)
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

export function editbroadcast (broadcast) {
  console.log('Editing broadcast message')
  console.log(broadcast)
  return (dispatch) => {
    callApi('broadcasts/edit', 'post', {broadcast: broadcast})
      .then(res => dispatch(loadBroadcastsList()))
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

export function sendbroadcast (broadcast) {
  console.log('Sending broadcast message', broadcast)
  return (dispatch) => {
    callApi('broadcasts/send', 'post', broadcast).then(res => {
      if (res.status === 'success') {
        dispatch(sendBroadcastSuccess())
      } else {
        dispatch(sendBroadcastFailure())
      }
      console.log('Send Broadcast Response', res)
    })
  }
}

export function downloadFile (broadcast) {
  return (dispatch) => {
    callApi(`broadcasts/downloadfile/${broadcast._id}`).then(res => {
      // dispatch(editBroadcast(res.payload));
      console.log('Send Broadcast Response', res)
    })
  }
}

export function uploadRequest ({ file, name }) {
  let data = new FormData()
  data.append('file', document)
  data.append('name', name)
  return (dispatch) => {
    callApi(`broadcasts/upload`, 'post', data).then(res => {
        // dispatch(editBroadcast(res.payload));
      console.log('Upload Action Response', res)
      if (res.status === 'success') {
        console.log('File Upload successfully')
      } else {
        console.log('Failed to upload')
      }
    })
  }
}

export function sendBroadcast (data, msg) {
  console.log('Sending Broadcast')
  console.log(data)
  return (dispatch) => {
    callApi('broadcasts/sendConversation', 'post', data)
      .then(res => {
        console.log('Response got from sendConversation', res)
        if (res.status === 'success') {
          msg.success('Conversation successfully sent')
          // dispatch(sendBroadcastSuccess())
        } else {
          msg.error('Failed to send conversation')
          // dispatch(sendBroadcastFailure())
        }
        dispatch(loadBroadcastsList())
      })
  }
}
