import * as ActionTypes from '../constants/constants'

const initialState = {
  permissions: [],
  zoomIntegrations: []
}
export function settingsInfo (state = initialState, action) {
  switch (action.type) {
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
    
    case ActionTypes.GET_ADVANCED_SETTINGS:
      return Object.assign({}, state, {
        advanced_settings: action.data
      })


case ActionTypes.GET_CANNED_RESPONSES:
  return Object.assign({}, state, {
    cannedResponses: action.data
  })

case ActionTypes.UPDATE_CANNED_RESPONSE: {
  let cannedResponses = state.cannedResponses
  let cannedResponsesIndex = cannedResponses.findIndex(cannedResponse => cannedResponse._id === action.data.responseId)
  cannedResponses[cannedResponsesIndex] = Object.assign(cannedResponses[cannedResponsesIndex], action.data)
  return Object.assign({}, state, {
    cannedResponses: [...cannedResponses]
  })
}
case ActionTypes.DELETE_CANNED_RESPONSE: {
let cannedResponses = state.cannedResponses
let cannedResponsesIndex = cannedResponses.findIndex(cannedResponse => cannedResponse._id === action.data.responseId)
  cannedResponses.splice(cannedResponsesIndex, 1)
  return Object.assign({}, state, {
    cannedResponses: [...cannedResponses]
  })
}
  
    case ActionTypes.ENABLE_SUCCESS_NGP:
      return Object.assign({}, state, {
        apiEnableNGP: action.data,
        apiDisableNGP: undefined
      })
    case ActionTypes.DISABLE_SUCCESS_NGP:
      return Object.assign({}, state, {
        apiDisableNGP: action.data
      })
    case ActionTypes.RESET_SUCCESS_NGP:
      return Object.assign({}, state, {
        resetDataNGP: action.data,
        apiEnableNGP: action.data,
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
    case ActionTypes.GET_GREETING_MESSAGE:
      return Object.assign({}, state, {
        greetingMessage: action.data
      })
    case ActionTypes.RESPONSE_METHOD:
      return Object.assign({}, state, {
        responseMethod: action.data.automated_options,
        showAgentName: action.data.showAgentName
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
    case ActionTypes.GET_INTEGRATIONS:
      return Object.assign({}, state, {
        integrations: action.data
      })
    case ActionTypes.SHOW_WHITELIST_DOMAINS:
      return Object.assign({}, state, {
        whitelistDomains: action.data
      })
    case ActionTypes.UPDATE_ZOOM_INTEGRATIONS:
      return Object.assign({}, state, {
        zoomIntegrations: action.data
      })
    default:
      return state
  }
}