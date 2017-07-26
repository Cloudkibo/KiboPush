import * as ActionTypes from '../constants/constants';

export function loadWorkFlowList() {
	//here we will fetch list of subscribers from endpoint
  var data = [{name: 'Workflow 1',keyWords:'Hello',condition:'when message contains',message:'Hi there!', isActive: 'Yes'}];	
  return {
    type: ActionTypes.LOAD_WORKFLOW_LIST,
    data
  };
}

export function addWorkFlow(token, data) {
	//here we will fetch list of subscribers from endpoint
  var data = {name: 'Workflow 1',keyWords:'Hello',condition:'when message contains',message:'Hi there!', isActive: 'Yes'};	
  return {
    type: ActionTypes.ADD_WORKFLOW,
    data
  };
}
