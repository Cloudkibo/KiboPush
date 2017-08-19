import * as ActionTypes from '../constants/constants'

const initialState = {
  browserName: '',
  browserVersion: '',
  socketStatus: false
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
    default:
      return state
  }
}
