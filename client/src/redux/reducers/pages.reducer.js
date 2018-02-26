import * as ActionTypes from '../constants/constants'

// const initialState = {
//   pages: [],
//   otherPages: []
// }

export function pagesInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
    case ActionTypes.FETCH_PAGES_LIST:
      return Object.assign({}, state, {
        otherPages: action.data,
        page_connected: '',
        message: ''
      })
    case ActionTypes.PAGE_CONNECT_WARNING:
      return Object.assign({}, state, {
        otherPages: action.pages,
        page_connected: action.page_connected,
        message: ''
      })
    case ActionTypes.PAGE_NOT_PUBLISHED:
      return Object.assign({}, state, {
        message: action.data,
        page_connected: ''
      })
    default:
      return state
  }
}
