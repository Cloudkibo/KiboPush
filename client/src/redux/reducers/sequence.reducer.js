import * as ActionTypes from '../constants/constants'

export function sequenceInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_ALL_SEQUENCE:
      return Object.assign({}, state, {
        sequences: action.sequence
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
