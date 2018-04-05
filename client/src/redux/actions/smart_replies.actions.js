import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showTeamsList (data) {
  return {
    type: ActionTypes.SHOW_TEAMS_LIST,
    teams: data.teams,
    teamUniquePages: data.teamUniquePages,
    teamUniqueAgents: data.teamUniqueAgents
  }
}

export function showBotsList (data) {
  return {
    type: ActionTypes.SHOW_BOTS,
    data
  }
}

export function loadBotsList () {
  return (dispatch) => {
    callApi('bots')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showBotsList(res.payload))
        }
      })
  }
}
