import * as ActionTypes from '../constants/constants'

const initialState = {
  users: [],
  broadcasts: []
}

export function UsersInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_USERS_LIST:
      return Object.assign({}, state, {
        users: action.data
      })

    default:
      return state
  }
}
export function broadcastsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data
      })

    default:
      return state
  }
}
