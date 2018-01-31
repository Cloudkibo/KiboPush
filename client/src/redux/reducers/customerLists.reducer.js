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
    default:
      return state
  }
}
