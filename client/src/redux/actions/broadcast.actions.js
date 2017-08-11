import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showbroadcasts (data) {
  return {
    type: ActionTypes.FETCH_BROADCASTS_LIST,
    data
  }
}
export function loadBroadcastsList () {
  console.log('Loading broadcast list')
  return (dispatch) => {
    callApi('broadcasts').then(res => dispatch(showbroadcasts(res.payload)))
  }
};

export function createbroadcast (broadcast) {
  console.log('Creating broadcast message')
  console.log(broadcast)
  return (dispatch) => {
    callApi('broadcasts/create', 'post', broadcast).then(res => dispatch(addBroadcast(res.payload)))
  }
};

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
    callApi('broadcasts/edit', 'post', {broadcast: broadcast}).then(res => dispatch(editBroadcast(res.payload)))
  }
};

export function editBroadcast (data) {
	// here we will edit the broadcast
  return {
    type: ActionTypes.EDIT_BROADCAST,
    data
  }
}


export function sendbroadcast (broadcast) {
  console.log('Sending broadcast message', broadcast);
  return (dispatch) => {
    callApi('broadcasts/send', 'post', broadcast).then(res => {
      // dispatch(editBroadcast(res.payload));
      console.log("Send Broadcast Response", res);
    })
  }
};