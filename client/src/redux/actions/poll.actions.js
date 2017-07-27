import * as ActionTypes from '../constants/constants';

export function loadPollsList() {
	//here we will fetch list of subscribers from endpoint
  console.log('Loading broadcast list');		
  var data = [];	
  return {
    type: ActionTypes.FETCH_POLLS_LIST,
    data
  };
}

export function addPoll(token, data) {
	//here we will add the broadcast
  return {
    type: ActionTypes.ADD_POLL,
    data
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