import * as ActionTypes from '../constants/constants'

const initialState = {
  storeList: [],
  isLoading: true
}

export function abandonedInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_STORE_LIST:
      return Object.assign({}, state, {
        storeList: action.data,
        isLoading: false
      })
    default:
      return state
  }
}
