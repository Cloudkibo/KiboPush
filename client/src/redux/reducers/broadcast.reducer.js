import * as ActionTypes from '../constants/constants'

// const initialState = {
//   broadcasts: []
// }

export function broadcastsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        count: action.count
      })
    case ActionTypes.ADD_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: [...state.broadcasts, action.data],
        showFileUploading: false
      })
    case ActionTypes.EDIT_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: action.data
      })
    case ActionTypes.GET_BROADCAST:
      return Object.assign({}, state, {
        broadcast: state.broadcasts.filter((c) => c._id === action.data)[0]
      })

    case ActionTypes.SHOW_FILE_UPLOAD_INDICATOR:
      return Object.assign({}, state, {
        showFileUploading: action.showFileUploading
      })

    case ActionTypes.SEND_BROADCAST_SUCCESS:
      return Object.assign({}, state, {
        successMessage: 'Broadcast sent successfully.'
      })

    case ActionTypes.SEND_BROADCAST_FAILURE:
      return Object.assign({}, state, {
        errorMessage: 'Broadcast Sending Failed.'
      })

    case ActionTypes.CLEAR_ALERT:
      return Object.assign({}, state, {
        errorMessage: '',
        successMessage: ''
      })

    default:
      return state
  }
}
