import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function loadWorkFlowList () {
  // here we will fetch list of subscribers from endpoint

  return (dispatch) => {
    callApi('workflows').then(res => dispatch(updateWorkFlowList(res)))
  }
}

export function updateWorkFlowList (data) {
  console.log('Data Fetched From Workflows', data)
  return {
    type: ActionTypes.LOAD_WORKFLOW_LIST,
    data
  }
}

export function updateWorkFlow (data) {
  return {
    type: ActionTypes.ADD_WORKFLOW,
    data
  }
}

export function addWorkFlow (data) {
  return (dispatch) => {
    callApi('workflows/create', 'post', data)
      .then(res => dispatch(updateWorkFlow(res.payload)))
  }
}
export function editWorkFlow (data) {
  return (dispatch) => {
    callApi('workflows/edit', 'post', data)
      .then(res => dispatch(loadWorkFlowList()))
  }
}
export function disableworkflow (data) {
  return (dispatch) => {
    callApi('workflows/disable', 'post', data)
      .then(res => dispatch(loadWorkFlowList()))
  }
}
export function enableworkflow (data) {
  return (dispatch) => {
    callApi('workflows/enable', 'post', data)
      .then(res => dispatch(loadWorkFlowList()))
  }
}
