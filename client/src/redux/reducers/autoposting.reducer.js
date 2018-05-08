import * as ActionTypes from '../constants/constants'

export function autopostingInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_AUTOPOSTING_LIST:
      return Object.assign({}, state, {
        autopostingData: action.autoposting,
        errorMessageCreate: '',
        successMessageCreate: ''
      })

    case ActionTypes.FETCH_AUTOPOSTING_MESSAGES_LIST:
      return Object.assign({}, state, {
        autoposting_messages: action.autoposting_messages,
        count: action.count
      })

    case ActionTypes.CREATE_AUTOPOSTING_SUCCESS:
      return Object.assign({}, state, {
        successMessageCreate: action.successMessage,
        errorMessageCreate: ''
      })

    case ActionTypes.CREATE_AUTOPOSTING_FAILURE:
      return Object.assign({}, state, {
        errorMessageCreate: action.errorMessage,
        successMessageCreate: ''
      })

    case ActionTypes.EDIT_AUTOPOSTING_SUCCESS:
      return Object.assign({}, state, {
        successMessageEdit: action.successMessage
      })

    case ActionTypes.EDIT_AUTOPOSTING_FAILURE:
      return Object.assign({}, state, {
        errorMessageEdit: action.errorMessage
      })

    case ActionTypes.CLEAR_AUTOPOSTING_ALERT_MESSAGES:
      return Object.assign({}, state, {
        successMessageEdit: '',
        errorMessageEdit: '',
        successMessageCreate: '',
        errorMessageCreate: ''
      })

    default:
      return state
  }
}
