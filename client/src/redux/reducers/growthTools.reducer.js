import * as ActionTypes from '../constants/constants'

const initialState = {
  status: '',
  description: ''
}

export function getFileUploadResponse (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_PHONE_NUMBERS:
      console.log('getFileUploadResponse', action.data)
      return Object.assign({}, state, {
        fileUploadResponse: action.data
      })
    case ActionTypes.CLEAR_ALERT_FILERESPONSE:
      return Object.assign({}, state, {
        fileUploadResponse: ''
      })
    default:
      return state
  }
}
