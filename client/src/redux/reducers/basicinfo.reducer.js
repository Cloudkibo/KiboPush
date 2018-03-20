import * as ActionTypes from '../constants/constants'

const initialState = {
  browserName: '',
  browserVersion: '',
  socketStatus: false,
  getStartedSeen: true,
  fbAppId: '',
  adminPageSubscription: []
}

export function basicInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_BROWSER_NAME:
      return Object.assign({}, state, {
        browserName: action.data
      })

    case ActionTypes.LOAD_BROWSER_VERSION:
      return Object.assign({}, state, {
        browserVersion: action.data
      })

    case ActionTypes.LOAD_USER_DETAILS:
      return Object.assign({}, state, {
        user: action.data
      })

    case ActionTypes.SET_SOCKET_STATUS:
      return Object.assign({}, state, {
        socketStatus: action.data
      })
    case ActionTypes.GET_STARTED_COMPLETED:
      return Object.assign({}, state, {
        getStartedSeen: true
      })
    case ActionTypes.STORE_FB_APP_ID:
      return Object.assign({}, state, {
        fbAppId: action.data
      })
    case ActionTypes.STORE_ADMIN_SUB_ID:
      return Object.assign({}, state, {
        adminPageSubscription: action.data
      })

    default:
      return state
  }
}
