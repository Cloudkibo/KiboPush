import * as ActionTypes from '../constants/constants'

export function convosInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_FILE_URL:
      return Object.assign({}, state, {
        fileUrl: action.fileUrl
      })

    default:
      return state
  }
}
