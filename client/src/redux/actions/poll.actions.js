import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';

export function updatePollsList(data){
  return {
    type: ActionTypes.FETCH_POLLS_LIST,
    data
  };
}

export function createPoll(data){
   return {
    type: ActionTypes.ADD_POLL,
    data
  };
}

export function loadPollsList() {
	//here we will fetch list of subscribers from endpoint
  console.log('Loading broadcast list');
  return (dispatch) => {
    callApi('polls').then(res => dispatch(updatePollsList(res)));
  };			
  
}

export function addPoll(token, data) {
	//here we will add the broadcast
  console.log('Loading broadcast list');
  return (dispatch) => {
    callApi('polls/create','post',data).then(res => dispatch(createPoll(data)));
  };
}
export function showresponses(data){
  return {
    type: ActionTypes.ADD_POLL_RESPONSES,
    data
  }; 
}
export function getpollresults(token, pollid) {
  return (dispatch) => {
    callApi(`polls/responses/${pollid}`).then(res => dispatch(showresponses(res.payload)));
  };
}
/* A poll should NOT be allowed to edit */

// export function editPoll(token, data) {
// 	//here we will edit the broadcast
//   return {
//     type: ActionTypes.EDIT_POLL,
//     data
//   };
// }