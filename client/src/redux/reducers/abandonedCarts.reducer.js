import * as ActionTypes from '../constants/constants'

const initialState = {
  isAppInstalled: false,
}

export function abandonedInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
    default:
      return state
  }
}
