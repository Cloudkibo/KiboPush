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

export function createTeam (data) {
  return (dispatch) => {
    callApi('teams/create', 'post', data)
      .then(res => {
        dispatch(loadTeamsList())
      })
  }
}

export function update (data) {
  return (dispatch) => {
    callApi('teams/update', 'post', data)
      .then(res => {
        dispatch(loadTeamsList())
      })
  }
}

export function addAgent (data) {
  return (dispatch) => {
    callApi('teams/addAgent', 'post', data)
      .then(res => {
        dispatch(loadTeamsList())
      })
  }
}

export function addPage (data) {
  return (dispatch) => {
    callApi('teams/addPage', 'post', data)
      .then(res => {
        dispatch(loadTeamsList())
      })
  }
}

export function removePage (data) {
  return (dispatch) => {
    callApi('teams/removePage', 'post', data)
      .then(res => {
        console.log('res', res)
        dispatch(loadTeamsList())
      })
  }
}

export function removeAgent (data) {
  return (dispatch) => {
    callApi('teams/removeAgent', 'post', data)
      .then(res => {
        console.log('res', res)
        dispatch(loadTeamsList())
      })
  }
}

export function loadTeamsList () {
  return (dispatch) => {
    callApi('teams')
      .then(res => {
        if (res.status === 'success') {
          console.log('loadTeamsList', res.payload)
          dispatch(showTeamsList(res.payload))
        }
      })
  }
}

export function deleteTeam (id, msg) {
  return (dispatch) => {
    callApi(`teams/delete/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Team deleted successfully')
          dispatch(loadTeamsList())
        }
      })
  }
}
