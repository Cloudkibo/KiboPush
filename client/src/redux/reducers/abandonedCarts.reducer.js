import * as ActionTypes from '../constants/constants'

const initialState = {
  storeList: [],
  isLoading: true,
  abandonedList: [],
  analytics: false
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
        isLoading: false
      })
    case ActionTypes.UPDATE_ANALYTICS:
      return Object.assign({}, state, {
        analytics: action.data
      })
    case ActionTypes.UPDATE_SENT_COUNT:
      let newList = state.abandonedList.map((item) => {
        if(item._id === action.data) {
          item.sentCount = item.sentCount + 1
          item.status = 'sent'
        }
        return item
      })
      return Object.assign({}, state, {
        abandonedList: newList
      })
    default:
      return state
  }
}
