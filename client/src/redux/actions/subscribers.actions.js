import * as ActionTypes from '../constants/constants';

export function loadSubscribersList() {
	//here we will fetch list of subscribers from endpoint
  console.log('loadSubscribersList called');		
  var data = [{firstname: 'John',lastname:'Doe',email:'johndoe@gmail.com',locale:'en-US',gender:'male'}];	
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
    data
  };
}
