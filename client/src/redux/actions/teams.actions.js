import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showTeamsList (data) {
  return {
    type: ActionTypes.SHOW_TEAMS_LIST,
    teams: data.teams,
    teamUniquePages: data.teamUniquePages
  }
}

export function createTeam (data) {
  return (dispatch) => {
    callApi('teams/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
      })
  }
}

export function loadTeamsList () {
  return (dispatch) => {
    callApi('teams')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showTeamsList(res.payload))
        }
      })
  }
}
