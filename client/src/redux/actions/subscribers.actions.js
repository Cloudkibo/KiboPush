import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';

export function updateSubscribersList(data){
  console.log("Data Fetched From Subscribers", data);
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
    data
  };
}

export function loadSubscribersList() {
	//here we will fetch list of subscribers from endpoint
  console.log('loadSubscribersList called');		    
  return (dispatch) => {
    callApi('subscribers').then(res => dispatch(updateSubscribersList(res)));
  };
  
 
}
