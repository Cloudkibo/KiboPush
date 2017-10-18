import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateChat (data) {
  console.log('Get Chat From Server', data)
  return {
    type: ActionTypes.UPDATE_CHAT,
    data
  }
}

export function updateSession (data) {
  console.log('Get Sessions From Server', data)
  return {
    type: ActionTypes.UPDATE_SESSION,
    data
  }
}

export function sendChat (data) {
  // here we will fetch list of subscribers from endpoint
  console.log('Sending Chat to Server')
  return (dispatch) => {
    callApi('dashboard/stats')
      .then(res => dispatch(updateDashboard(res.payload)))
  }
}


export function getSession (data) {
  // here we will fetch list of subscribers from endpoint
  data = {
    
  }
  console.log('Sending Chat to Server')
  return (dispatch) => {
    // callApi('sessions')
    //   .then(res => dispatch(updateDashboard(res.payload)))
    dispatch(updateSession(data))
  }
}