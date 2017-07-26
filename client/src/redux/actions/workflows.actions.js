import * as ActionTypes from '../constants/constants';
var axios = require('axios');

export function loadWorkFlowList() {
	//here we will fetch list of subscribers from endpoint
  var data = [{name: 'Workflow 1',keyWords:'Hello',condition:'when message contains',message:'Hi there!', isActive: 'Yes'}];	
  return {
    type: ActionTypes.LOAD_WORKFLOW_LIST,
    data
  };
}

export function updateWorkFlow(data){
  return {
      type: ActionTypes.ADD_WORKFLOW,
      data
    };
}

export function addWorkFlow(token, data) {
  data = {name: 'Workflow 1',keyWords:'Hello',condition:'when message contains',message:'Hi there!', isActive: 'Yes'};	
  return (dispatch) => {
    axios.post('/api/workflows/create', data)
    .then(function (response) {
      console.log(response.data);
      return dispatch(updateWorkFlow(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
 
}
