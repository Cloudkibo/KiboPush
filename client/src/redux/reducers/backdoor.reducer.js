import * as ActionTypes from '../constants/constants'

const initialState = {
  users: [],
  broadcasts: [],
  pages: []
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

export function PagesInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_PAGES_LIST:
      return Object.assign({}, state, {
        users: action.data
      })

    default:
      return state
  }
}
