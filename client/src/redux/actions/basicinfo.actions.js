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
  console.log('Tour Completed')
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', tour).then(res => dispatch(updateDashboardTour()))
  }
}
export function updateDashboardTour () {
  console.log('In updateTour')
  return {
    type: ActionTypes.DASHBOARD_TOUR_COMPLETED
  }
}

export function getTourStatus () {

}
