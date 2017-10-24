import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function setBrowserName (data) {
  return {
    type: ActionTypes.LOAD_BROWSER_NAME,
    data
  }
}
export function showuserdetails (data) {
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
    data
  }
}

export function getuserdetails () {
  console.log('getuserdetails')

  return (dispatch) => {
    callApi('users').then(res => dispatch(showuserdetails(res.payload)))
  }
}

export function setBrowserVersion (data) {
  return {
    type: ActionTypes.LOAD_BROWSER_VERSION,
    data
  }
}

export function setSocketStatus (data) {
  return {
    type: ActionTypes.SET_SOCKET_STATUS,
    data
  }
}

export function dashboardTourCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateDashboardTour()))
  }
}
export function updateDashboardTour () {
  return {
    type: ActionTypes.DASHBOARD_TOUR_COMPLETED
  }
}

export function workflowsTourCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateWorkflowsTour()))
  }
}
export function updateWorkflowsTour () {
  return {
    type: ActionTypes.WORKFLOWS_TOUR_COMPLETED
  }
}

export function surveyTourCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateSurveyTour()))
  }
}
export function updateSurveyTour () {
  return {
    type: ActionTypes.SURVEY_TOUR_COMPLETED
  }
}

export function convoTourCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateConvoTour()))
  }
}
export function updateConvoTour () {
  return {
    type: ActionTypes.CONVO_TOUR_COMPLETED
  }
}

export function pollTourCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updatePollTour()))
  }
}
export function updatePollTour () {
  return {
    type: ActionTypes.POLL_TOUR_COMPLETED
  }
}

export function getStartedCompleted (tour) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateGetStarted()))
  }
}
export function updateGetStarted () {
  return {
    type: ActionTypes.POLL_TOUR_COMPLETED
  }
}
