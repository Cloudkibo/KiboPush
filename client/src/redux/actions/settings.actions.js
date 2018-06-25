import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function enableSuccess (data) {
  return {
    type: ActionTypes.ENABLE_SUCCESS,
    data
  }
}
export function getResponseMethod (data) {
  return {
    type: ActionTypes.RESPONSE_METHOD,
    data
  }
}
export function showDeleteOption (data) {
  return {
    type: ActionTypes.DELETE_OPTION,
    data
  }
}
export function get (data) {
  return {
    type: ActionTypes.ENABLE_SUCCESS,
    data
  }
}
export function disableSuccess (data) {
  return {
    type: ActionTypes.DISABLE_SUCCESS,
    data
  }
}

export function resetSuccess (data) {
  return {
    type: ActionTypes.RESET_SUCCESS,
    data
  }
}

export function getAPISuccess (data) {
  return {
    type: ActionTypes.GET_API_SUCCESS,
    data
  }
}

export function getPermissionsSuccess (data) {
  return {
    type: ActionTypes.GET_PERMISSIONS_SUCCESS,
    data
  }
}

export function getUpdatedPermissionsSuccess (data) {
  return {
    type: ActionTypes.GET_UPDATED_PERMISSIONS_SUCCESS,
    data
  }
}

export function getAPIFailure (data) {
  return {
    type: ActionTypes.GET_API_FAILURE,
    data
  }
}

export function saveSwitchState () {
  return {
    type: ActionTypes.SAVE_SWITCH_STATE,
    data: 'changed'
  }
}

export function showGreetingMessage (data) {
  return {
    type: ActionTypes.GET_GREETING_MESSAGE,
    data: data
  }
}
export function showWebhook (data) {
  return {
    type: ActionTypes.SHOW_WEBHOOK,
    data
  }
}
export function showWebhookResponse (data) {
  return {
    type: ActionTypes.SHOW_WEBHOOK_RESPONSE,
    data
  }
}
export function enable (API) {
  return (dispatch) => {
    callApi('api_settings/enable', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('enable', res.payload)
          dispatch(enableSuccess(res.payload))
        }
      })
  }
}
export function disable (API) {
  return (dispatch) => {
    callApi('api_settings/disable', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('disable', res.payload)
          dispatch(disableSuccess(res.payload))
        }
      })
  }
}

export function reset (API) {
  return (dispatch) => {
    callApi('api_settings/reset', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          dispatch(resetSuccess(res.payload))
        }
      })
  }
}

export function getAPI (API) {
  return (dispatch) => {
    callApi('api_settings/', 'post', API)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          dispatch(getAPISuccess(res.payload))
        } else if (res.status === 'failed') {
          dispatch(getAPIFailure(res.description))
        }
      })
  }
}

export function getPermissions () {
  return (dispatch) => {
    callApi('permissions/fetchPermissions')
      .then(res => {
        if (res.status === 'success') {
          console.log('permissions', res.payload)
          dispatch(getPermissionsSuccess(res.payload))
        }
      })
  }
}

export function updatePermission (updatedPermissions, msg) {
  return (dispatch) => {
    callApi('permissions/updatePermissions', 'post', updatedPermissions)
      .then(res => {
        if (res.status === 'success') {
          console.log('Updated Permission from Server', res.payload)
          msg.success('Permission Updated Successfully')
          dispatch(getUpdatedPermissionsSuccess(res.payload))
        } else if (res.status === 'failed') {
          msg.success('Permission Update Failed')
        }
      })
  }
}

/*
NGP API WORK STARTS
 */

export function enableSuccessNGP (data) {
  return {
    type: ActionTypes.ENABLE_SUCCESS_NGP,
    data
  }
}

export function disableSuccessNGP (data) {
  return {
    type: ActionTypes.DISABLE_SUCCESS_NGP,
    data
  }
}

export function saveSuccessNGP (data) {
  return {
    type: ActionTypes.RESET_SUCCESS_NGP,
    data
  }
}

export function getAPISuccessNGP (data) {
  return {
    type: ActionTypes.GET_API_SUCCESS_NGP,
    data
  }
}

export function getAPIFailureNGP (data) {
  return {
    type: ActionTypes.GET_API_FAILURE_NGP,
    data
  }
}

export function enableNGP (API) {
  return (dispatch) => {
    callApi('api_ngp/enable', 'post', API)
    .then(res => {
      if (res.status === 'success') {
        console.log('enable ngp', res.payload)
        dispatch(enableSuccessNGP(res.payload))
      }
    })
  }
}
export function disableNGP (API) {
  return (dispatch) => {
    callApi('api_ngp/disable', 'post', API)
    .then(res => {
      if (res.status === 'success') {
        console.log('disable', res.payload)
        dispatch(disableSuccessNGP(res.payload))
      }
    })
  }
}

export function saveNGP (API) {
  console.log(API)
  return (dispatch) => {
    callApi('api_ngp/save', 'post', API)
    .then(res => {
      if (res.status === 'success') {
        console.log('reset', res.payload)
        dispatch(saveSuccessNGP(res.payload))
      }
    })
  }
}

export function getNGP (API) {
  return (dispatch) => {
    callApi('api_ngp/', 'post', API)
    .then(res => {
      if (res.status === 'success') {
        console.log('reset', res.payload)
        dispatch(getAPISuccessNGP(res.payload))
      } else if (res.status === 'failed') {
        dispatch(getAPIFailureNGP(res.description))
      }
    })
  }
}

/*
NGP API WORK ENDS
 */

export function changePass (data, msg) {
  return (dispatch) => {
    callApi('reset_password/change', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('reset', res.payload)
          msg.success('Password changed successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function saveGreetingMessage (data, msg) {
  return (dispatch) => {
    callApi('pages/saveGreetingText', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Greeting message saved successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function saveResponseMethod (data, msg) {
  return (dispatch) => {
    callApi('company/updateAutomatedOptions', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(getResponseMethod(res.payload))
          msg.success('Response Method saved successfully')
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function findResponseMethod () {
  return (dispatch) => {
    callApi('company/getAutomatedOptions')
      .then(res => {
        if (res.status === 'success') {
          dispatch(getResponseMethod(res.payload))
        } else if (res.status === 'failed') {
          console.log(`Getting response method fails. ${res.description}`)
        }
      })
  }
}
export function loadWebhook () {
  return (dispatch) => {
    callApi('webhooks')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWebhook(res.payload))
        }
      })
  }
}
export function createEndpoint (data) {
  console.log('data for createEndpoint', data)
  return (dispatch) => {
    callApi('webhooks/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWebhookResponse('success'))
          dispatch(loadWebhook())
        } else {
          dispatch(showWebhookResponse(res.description))
          //  msg.error(res.description)
        }
      })
  }
}
export function editEndpoint (data) {
  console.log('data for editEndpoint', data)
  return (dispatch) => {
    callApi('webhooks/edit', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWebhookResponse('success'))
          dispatch(loadWebhook())
        } else {
          dispatch(showWebhookResponse(res.description))
          //  msg.error(res.description)
        }
      })
  }
}
export function enabled (data, msg) {
  console.log('data for enabled', data)
  return (dispatch) => {
    callApi('webhooks/enabled', 'post', data)
      .then(res => {
        console.log('response from enabled', res)
        if (res.status === 'success') {
          if (data.isEnabled) {
            msg.success('Webhook Enabled!')
          } else {
            msg.success('Webhook Disabled!')
          }
          dispatch(loadWebhook())
        } else {
          //  msg.error(res.description)
        }
      })
  }
}
export function saveDeleteOption (data, msg) {
  return (dispatch) => {
    dispatch(showDeleteOption(data))
  }
}
export function authenticatePassword (data, msg, handleAuthentication) {
  return (dispatch) => {
    callApi('users/authenticatePassword', 'post', data)
      .then(res => {
        console.log('response from msg', res)
        if (res.status === 'success') {
          msg.success('Authenticated')
        } else {
          msg.error(res.description)
        }
        handleAuthentication(res)
      })
  }
}
