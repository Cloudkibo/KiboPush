import * as ActionTypes from '../constants/constants'

// const initialState = {
//   pages: [],
//   otherPages: []
// }

export function pagesInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_PAGE:
      return Object.assign({}, state, {
        currentPage: action.data
      })
    case ActionTypes.LOAD_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
      case ActionTypes.SAVE_WELCOME_MESSAGE:
      let pages = state.pages
      let pageIndex = pages.findIndex(page => page._id === action.data._id)
      pages[pageIndex].welcomeMessage = action.data.welcomeMessage
      return Object.assign({}, state, {
        pages: pages
      })
    case ActionTypes.LOAD_PAGES_LIST_NEW:
      return Object.assign({}, state, {
        pages: action.pages,
        count: action.count
      })
    case ActionTypes.FETCH_PAGES_LIST:
      return Object.assign({}, state, {
        otherPages: action.data,
        page_connected: '',
        message: ''
      })
    case ActionTypes.PAGE_CONNECT_WARNING:
      return Object.assign({}, state, {
        page_connected: action.page_connected,
        message: ''
      })
    case ActionTypes.PAGE_NOT_PUBLISHED:
      return Object.assign({}, state, {
        message: action.data,
        page_connected: ''
      })
    case ActionTypes.UPDATE_REACH_ESTIMATION:
      return Object.assign({}, state, {
        currentReachEstimation: action.data
      })
    default:
      return state
  }
}
