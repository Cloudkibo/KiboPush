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

export function showPagesList (data) {
  return {
    type: ActionTypes.SHOW_TEAM_PAGES,
    teamPages: data
  }
}

export function showAgentsList (data) {
  return {
    type: ActionTypes.SHOW_TEAM_AGENTS,
    teamAgents: data
  }
}

export function createTeam (data, cb) {
  console.log('data forcreateTeam ', data)
  return (dispatch) => {
    callApi('teams/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        }
        if (cb) cb(res)
      })
  }
}

export function update (data, msg) {
  console.log('update team data', data)
  return (dispatch) => {
    callApi('teams/update', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        } else {
          msg.error(res.description || 'Failed to edit team')
        }
      })
  }
}

export function addAgent (data, msg) {
  return (dispatch) => {
    callApi('teams/addAgent', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        } else {
          msg.error(res.description || 'Failed to add agent')
        }
      })
  }
}

export function addPage (data, msg) {
  return (dispatch) => {
    callApi('teams/addPage', 'post', data)
      .then(res => {
        console.log('addpage', res)
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        } else {
          msg.error(res.description || 'Failed to add page')
        }
      })
  }
}

export function removePage (data, msg) {
  return (dispatch) => {
    callApi('teams/removePage', 'post', data)
      .then(res => {
        console.log('res', res)
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        } else {
          msg.error(res.description || 'Failed to remove page')
        }
      })
  }
}

export function removeAgent (data, msg) {
  console.log('data', data)
  return (dispatch) => {
    callApi('teams/removeAgent', 'post', data)
      .then(res => {
        console.log('res', res)
        if (res.status === 'success') {
          dispatch(loadTeamsList())
        } else {
          msg.error(res.description || 'Failed to remove agent')
        }
      })
  }
}

export function loadTeamsList (data) {
  return (dispatch) => {
    callApi('teams', 'post', data)
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
        } else {
          msg.error(res.description || 'Unable to delete team')
        }
      })
  }
}

export function fetchPages (id) {
  console.log('fetchPages', id)
  return (dispatch) => {
    callApi(`teams/fetchPages/${id}`)
      .then(res => {
        console.log('response from fetchPages', res)
        if (res.status === 'success') {
          console.log('fetchPages', res.payload)
          dispatch(showPagesList(res.payload))
        }
      })
  }
}

export function fetchAgents (id) {
  console.log('fetchAgents', id)
  return (dispatch) => {
    callApi(`teams/fetchAgents/${id}`)
      .then(res => {
        if (res.status === 'success') {
          console.log('fetchAgents', res.payload)
          dispatch(showAgentsList(res.payload))
        }
      })
  }
}
