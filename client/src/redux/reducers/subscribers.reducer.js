import * as ActionTypes from '../constants/constants'

const initialState = {
  subscribers: []
}

export function subscribersInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        subscribers: action.data
      })

    default:
      return state
  }
}
