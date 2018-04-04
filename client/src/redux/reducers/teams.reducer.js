import * as ActionTypes from '../constants/constants'

export function teamsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_TEAMS_LIST:
      return Object.assign({}, state, {
        teams: action.teams,
        teamUniquePages: action.teamUniquePages,
        teamUniqueAgents: action.teamUniqueAgents,
        teamPages: [],
        teamAgents: []
      })
    case ActionTypes.SHOW_TEAM_PAGES:
      return Object.assign({}, state, {
        teamPages: action.teamPages
      })
    case ActionTypes.SHOW_TEAM_AGENTS:
      return Object.assign({}, state, {
        teamAgents: action.teamAgents
      })
    default:
      return state
  }
}
