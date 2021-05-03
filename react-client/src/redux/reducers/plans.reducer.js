import * as ActionTypes from '../constants/constants'

export function plansInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_PLANS_LIST:
      return Object.assign({}, state, {
        plansInfo: action.data
      })
    default:
      return state
  }
}
