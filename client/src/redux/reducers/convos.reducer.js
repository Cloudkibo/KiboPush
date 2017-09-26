import * as ActionTypes from '../constants/constants'

export function convosInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_FILE_INFO:
      return Object.assign({}, state, {
        fileInfo: action.fileInfo
      })

    case ActionTypes.ADD_FILE_URL:
      return Object.assign({}, state, {
        fileInfo: Object.assign({}, state.fileInfo, {
          fileurl: action.fileUrl
        })
      })

    default:
      return state
  }
}
