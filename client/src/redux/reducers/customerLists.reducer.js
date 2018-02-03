import * as ActionTypes from '../constants/constants'

// const initialState = {
//   surveys: []
// }

export function listsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_CUSTOMER_LISTS:
      return Object.assign({}, state, {
        customerLists: action.data
      })
    case ActionTypes.ADD_NEW_LIST:
      return Object.assign({}, state, {
        surveys: [...state.customerLists, action.data.payload],
        createwarning: action.data.status
      })
    default:
      return state
  }
}
