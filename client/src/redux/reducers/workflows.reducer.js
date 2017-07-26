import * as ActionTypes from '../constants/constants';

const initialState = {
  workflows: [],

};

export function workflowsInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_WORKFLOW_LIST:
      return Object.assign({}, state, {
        workflows: action.data
      });
    case ActionTypes.ADD_WORKFLOW:
      return Object.assign({}, state, {
        workflows: [...state.workflows, action.data]
      });

   
    default:
      return state;
  }
}
