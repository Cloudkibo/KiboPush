import * as ActionTypes from '../constants/constants';
var axios = require('axios');

export function updateSubscribersList(data){
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
    data
  };
}

export function loadSubscribersList() {
	//here we will fetch list of subscribers from endpoint
  console.log('loadSubscribersList called');		
  return (dispatch) => {
    axios.get('/api/subscribers/fetch')
    .then(function (response) {
      console.log(response.data);
      return dispatch(updateSubscribersList(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
