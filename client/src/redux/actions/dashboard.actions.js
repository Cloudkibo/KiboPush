import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboard (data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}
export function updateGraphData (data) {
  return {
    type: ActionTypes.UPDATE_GRAPH_DATA,
    data
  }
}
export function updateTopPages (data) {
  return {
    type: ActionTypes.UPDATE_TOP_PAGES,
    data
  }
}
export function updateSentVsSeen (data) {
  return {
    type: ActionTypes.UPDATE_SENT_VS_SEEN,
    data
  }
}

export function loadDashboardData () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/stats')
      .then(res => dispatch(updateDashboard(res.payload)))
  }
}

export function sentVsSeen () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/sentVsSeen')
      .then(res => dispatch(updateSentVsSeen(res.payload)))
  }
}
export function loadGraphData (days) {
  return (dispatch) => {
    callApi(`dashboard/graphData/${days}`)
      .then(res => dispatch(updateGraphData(res.payload)))
  }
}
export function loadTopPages () {
  return (dispatch) => {
    callApi(`dashboard/topPages/`)
      .then(res => dispatch(updateTopPages(res.payload)))
  }
}
