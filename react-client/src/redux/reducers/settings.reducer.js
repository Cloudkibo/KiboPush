import * as ActionTypes from '../constants/constants'

const initialState = {
  permissions: []
}
export function settingsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ENABLE_SUCCESS:
      return Object.assign({}, state, {
        apiEnable: action.data
      })
    case ActionTypes.DISABLE_SUCCESS:
      return Object.assign({}, state, {
        apiDisable: action.data
      })
    case ActionTypes.RESET_SUCCESS:
      return Object.assign({}, state, {
        resetData: action.data
      })
    case ActionTypes.GET_API_SUCCESS:
      return Object.assign({}, state, {
        apiSuccess: action.data
      })
    case ActionTypes.GET_PERMISSIONS_SUCCESS:
      return Object.assign({}, state, {
        permissions: action.data
      })
    case ActionTypes.GET_UPDATED_PERMISSIONS_SUCCESS:
      let oldPermissions = state.permissions
      for (let i = 0; i < oldPermissions.length; i++) {
        if (oldPermissions[i].userId._id === action.data.userId._id) {
          oldPermissions[i] = action.data
          console.log('updated the data')
        }
      }
      return Object.assign({}, state, {
        permissions: oldPermissions
      })
    case ActionTypes.GET_API_FAILURE:
      return Object.assign({}, state, {
        apiFailure: action.data
      })
    case ActionTypes.ENABLE_SUCCESS_NGP:
      return Object.assign({}, state, {
        apiEnableNGP: action.data
      })
    case ActionTypes.DISABLE_SUCCESS_NGP:
      return Object.assign({}, state, {
        apiDisableNGP: action.data
      })
    case ActionTypes.RESET_SUCCESS_NGP:
      return Object.assign({}, state, {
        resetDataNGP: action.data,
        apiSuccessNGP:action.data
      })
    case ActionTypes.GET_API_SUCCESS_NGP:
      return Object.assign({}, state, {
        apiSuccessNGP: action.data
      })
    case ActionTypes.GET_API_FAILURE_NGP:
      return Object.assign({}, state, {
        apiFailureNGP: action.data
      })
    case ActionTypes.SAVE_SWITCH_STATE:
      return Object.assign({}, state, {
        switchState: action.data
      })
    case ActionTypes.GET_GREETING_MESSAGE:
      return Object.assign({}, state, {
        greetingMessage: action.data
      })
    case ActionTypes.RESPONSE_METHOD:
      return Object.assign({}, state, {
        responseMethod: action.data.automated_options
      })
    case ActionTypes.SHOW_WEBHOOK:
      return Object.assign({}, state, {
        webhook: action.data,
        response: ''
      })
    case ActionTypes.SHOW_WEBHOOK_RESPONSE:
      return Object.assign({}, state, {
        response: action.data
      })
    default:
      return state
  }
}
