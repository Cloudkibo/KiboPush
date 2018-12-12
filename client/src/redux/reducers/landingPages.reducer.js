import * as ActionTypes from '../constants/constants'

export function landingPagesInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_LANDING_PAGES:
      return Object.assign({}, state, {
        landingPages: action.data
      })
    default:
      return state
  }
}
