import * as ActionTypes from '../constants/constants';

export function loadBroadcastsList() {
	//here we will fetch list of subscribers from endpoint
  console.log('Loading broadcast list');		
  var data = [{firstname: 'John',lastname:'Doe',email:'johndoe@gmail.com',locale:'en-US',gender:'male'}];	
  return {
    type: ActionTypes.FETCH_BROADCASTS_LIST,
    data
  };
}

export function addBroadcast(token, data) {
	//here we will add the broadcast
  return {
    type: ActionTypes.ADD_BROADCAST,
    data
  };
}