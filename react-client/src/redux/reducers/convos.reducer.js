import * as ActionTypes from '../constants/constants'

export function convosInfo (state = {loading: true}, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return Object.assign({}, state, {
        loading: true
      })

    default:
      return state
  }
}
