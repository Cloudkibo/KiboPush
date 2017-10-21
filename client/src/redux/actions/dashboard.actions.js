import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboard (data) {
  console.log('Data Fetched From Server', data)
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}

export function loadDashboardData () {
  // here we will fetch list of subscribers from endpoint
  console.log('loading dashboard data')
  return (dispatch) => {
    callApi('dashboard/stats')
      .then(res => dispatch(updateDashboard(res.payload)))
    // var res = {
    //   pages: 13,
    //   subscribers: 26,
    //   scheduledBroadcast: 0,
    //   recentBroadcasts: [],
    //   username: 'Dayem Siddiqui',
    //   activityChart: {
    //     polls: 24,
    //     messages: 13,
    //     surveys: 45
    //   }
    // }
    // dispatch(updateDashboard(res))
  }
}
