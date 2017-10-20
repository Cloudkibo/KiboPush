import * as ActionTypes from '../constants/constants'

const initialState = {
  dashboard: {
    pages: 0,
    subscribers: 0,
    scheduledBroadcast: 0,
    tour: false,
    recentBroadcasts: [],
    username: '',
    activityChart: {
      polls: 0,
      messages: 0,
      surveys: 0
    }
  }

}

export function dashboardInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DASHBOARD:
      return Object.assign({}, state, {
        dashboard: action.data
      })

    case ActionTypes.DASHBOARD_TOUR_COMPLETED:
      console.log('In tourcompleted reducer')
      return Object.assign({}, state, {
        tour: true
      })

    default:
      return state
  }
}
