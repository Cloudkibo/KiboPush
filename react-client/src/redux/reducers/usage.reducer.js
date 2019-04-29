import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function usageInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_USAGE:
      return Object.assign({}, state, {
        usage: action.data
      })

    default:
      return state
  }
}
