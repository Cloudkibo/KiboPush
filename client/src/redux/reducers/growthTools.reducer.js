import * as ActionTypes from '../constants/constants'

const initialState = {
  files: []
}

export function getFileUploadResponse (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_PHONE_NUMBERS:
      console.log('getFileUploadResponse', action.data)
      return Object.assign({}, state, {
        fileUploadResponse: action.data
      })

    default:
      return state
  }
}
