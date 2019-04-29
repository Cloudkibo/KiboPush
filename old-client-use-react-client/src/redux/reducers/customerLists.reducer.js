import * as ActionTypes from '../constants/constants'

// const initialState = {
//   surveys: []
// }

export function listsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_REPLIED_SURVEY_SUBSCRIBERS:
      return Object.assign({}, state, {
        surveySubscribers: action.data
      })
    case ActionTypes.LOAD_REPLIED_POLL_SUBSCRIBERS:
      return Object.assign({}, state, {
        pollSubscribers: action.data
      })
    case ActionTypes.LOAD_CUSTOMER_LISTS:
      return Object.assign({}, state, {
        customerLists: action.data
      })
    case ActionTypes.LOAD_CUSTOMER_LISTS_NEW:
      return Object.assign({}, state, {
        customerLists: action.lists,
        count: action.count
      })
    case ActionTypes.ADD_NEW_LIST:
      return Object.assign({}, state, {
        customerLists: [...state.customerLists, action.data.payload],
        createwarning: action.data.status
      })
    case ActionTypes.LOAD_LIST_DETAILS:
      return Object.assign({}, state, {
        listDetails: action.data
      })
    case ActionTypes.CURRENT_CUSTOMER_LIST:
      return Object.assign({}, state, {
        currentList: action.data
      })
    case ActionTypes.CLEAR_CURRENT_CUSTOMER_LIST:
      return Object.assign({}, state, {
        currentList: action.data
      })
    default:
      return state
  }
}
