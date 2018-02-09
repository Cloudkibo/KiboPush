import * as ActionTypes from '../constants/constants'

const initialState = {
  status: '',
  description: '',
  nonSubscribersData: ''
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

export function nonSubscribersInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_NON_SUBSCRIBERS_DATA:
      return Object.assign({}, state, {
        nonSubscribersData: action.data
      })

    default:
      return state
  }
}
