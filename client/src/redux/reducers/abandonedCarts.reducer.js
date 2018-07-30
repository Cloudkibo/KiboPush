import * as ActionTypes from '../constants/constants'

const initialState = {
  storeList: [],
  isLoading: true,
  abandonedList: []
}

export function abandonedInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_STORE_LIST:
      return Object.assign({}, state, {
        storeList: action.data,
        isLoading: false
      })
    case ActionTypes.UPDATE_ABANDONED_LIST:
      return Object.assign({}, state, {
        abandonedList: action.data,
      })
    default:
      return state
  }
}
