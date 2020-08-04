import {getAutomatedOptions, getuserdetails} from './basicinfo.actions'
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function updateZoomIntegrations (data) {
  return {
    type: ActionTypes.UPDATE_ZOOM_INTEGRATIONS,
    data
  }
}

export function removeZoomIntegration (data) {
  return {
    type: ActionTypes.REMOVE_ZOOM_INTEGRATION,
    data
  }
}

export function showIntegrations (data) {
  return {
    type: ActionTypes.GET_INTEGRATIONS,
    data
  }
}

export function showAdminAlerts (data) {
  return {
    type: ActionTypes.SHOW_ADMINALERTS,
    data
  }
}

export function showWhiteListDomains (data) {
  return {
    type: ActionTypes.SHOW_WHITELIST_DOMAINS,
    data
  }
}

export function showAdvancedSettings (data) {
  console.log(data)
  return {
    type: ActionTypes.GET_ADVANCED_SETTINGS,
    data
  }
}

export function showcannedResponses (data) {
  return {
    type: ActionTypes.GET_CANNED_RESPONSES,
    data
  }
}

export function editCannedResponse (data) {
  return {
    type: ActionTypes.UPDATE_CANNED_RESPONSE,
    data
  }
}
export function RemoveCannedResponse (data) {
  return {
    type: ActionTypes.DELETE_CANNED_RESPONSE,
    data
  }
}

export function getResponseMethod (data) {
  return {
    type: ActionTypes.RESPONSE_METHOD,
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

export function updateWhatsAppMessageTemplates (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPP_MESSAGE_TEMPLATES,
    data
  }
}

export function getPermissions () {
  return (dispatch) => {
    callApi('permissions/fetchPermissions')
      .then(res => {
        console.log('getPermissions', res)
        if (res.status === 'success') {
          console.log('permissions', res.payload)
          dispatch(getPermissionsSuccess(res.payload))
        }
      })
  }
}

export function fetchNotifications () {
  return (dispatch) => {
    callApi('companyPreferences/')
      .then(res => {
         res = {status: 'success', payload: { pendingSessionAlert : {
            enabled: true,
            notification_interval: 5,
            interval_unit: 'mins',
            assignedMembers: 'both'
            }, 
            unresolveSessionAlert: {
            enabled: true,
            notification_interval: 30,
            interval_unit: 'mins',
            assignedMembers: 'buyer'
            }
          }
        }
        dispatch(showAdminAlerts(res.payload)) 
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
  console.log('saveSuccessNGP',data )
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

export function saveNGP (API, msg) {
  console.log(API)
  return (dispatch) => {
    callApi('api_ngp/save', 'post', API)
    .then(res => {
      if (res.status === 'success') {
        console.log('reset', res.payload)
        msg.success('Saved successfully')
        dispatch(saveSuccessNGP(res.payload))
      } else {
        msg.error(res.description)
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
export function saveWhiteListDomains (data, msg, handleResponse) {
  return (dispatch) => {
    callApi('pages/whitelistDomain', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          handleResponse(res)
        } else {
          msg.error(res.description)
        }
      })
  }
}
export function saveResponseMethod (data, msg) {
  console.log('data for saveResponseMethod', data)
  return (dispatch) => {
    callApi('company/updateAutomatedOptions', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('res', res)
          dispatch(getResponseMethod(res.payload))
          dispatch(getAutomatedOptions())
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
          console.log('response method', res.payload)
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
export function createEndpoint (data, msg) {
  console.log('data for createEndpoint', data)
  return (dispatch) => {
    callApi('webhooks/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWebhookResponse('success'))
          dispatch(loadWebhook())
        } else {
          //  dispatch(showWebhookResponse(res.description))
          msg.error(res.description)
        }
      })
  }
}
export function editEndpoint (data, msg) {
  console.log('data for editEndpoint', data)
  return (dispatch) => {
    callApi('webhooks/edit', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWebhookResponse('success'))
          dispatch(loadWebhook())
        } else {
          //  dispatch(showWebhookResponse(res.description))
          msg.error(res.description)
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
export function saveDeleteOption (data, msg, handleSave) {
  return (dispatch) => {
    callApi('users/enableDelete', 'post', data)
      .then(res => {
        console.log('response from msg', res)
        if (res.status === 'success') {
          msg.success('Delete request has been sent')
        } else {
          msg.error(res.description)
        }
        handleSave(res)
      })
  }
}
export function authenticatePassword (data, msg, handleAuthentication) {
  return (dispatch) => {
    callApi('users/authenticatePassword', 'post', data)
      .then(res => {
        console.log('response from msg', res)
        if (res.status !== 'success') {
          msg.error('Incorrect Password')
        }
        handleAuthentication(res)
      })
  }
}
export function cancelDeletion (msg, handleCancel) {
  return (dispatch) => {
    callApi('users/cancelDeletion')
      .then(res => {
        console.log('response from msg', res)
        if (res.status === 'success') {
          msg.success('Request to cancel deletion process has been sent to admin.')
        }
        handleCancel(res)
      })
  }
}
export function uploadCustomerInfoFile (data, msg) {
  return (dispatch) => {
    callApi('demoApp/uploadCustomerInfo', 'post', data)
      .then(res => {
        console.log('response from msg', res)
        if (res.status === 'success') {
          msg.success('File uploaded successfully!')
        }
      })
  }
}
export function fetchWhiteListedDomains (pageId, handleFetch) {
  return (dispatch) => {
    callApi(`pages/fetchWhitelistedDomains/${pageId}`)
      .then(res => {
        console.log('whitelisted domains', res)
        if (res.status === 'success') {
          if (handleFetch) {
            handleFetch(res)
          }
          dispatch(showWhiteListDomains(res.payload))
        } else {
          console.log(res.description)
        }
      })
  }
}

export function deleteDomain (payload, msg, handleDelete) {
  return (dispatch) => {
    callApi('pages/deleteWhitelistDomain', 'post', payload)
      .then(res => {
        console.log('whitelisted domains', res)
        if (res.status === 'success') {
          if (handleDelete) {
           handleDelete(res)
          }
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function updatePlatformSettings (data, msg, clearFields, platform) {
  console.log('data for updatePlatformSettings', data)
  return (dispatch) => {
    callApi('company/updatePlatform', 'post', data)
      .then(res => {
        console.log('response from updatePlatformSettings', res)
        if (res.status === 'success') {
          dispatch(getAutomatedOptions())
          dispatch(getuserdetails())
          msg.success('Saved Successfully')
          if (platform && platform === 'sms') {
            dispatch(fetchValidCallerIds(data))
          }
        } else {
          msg.error(res.description)
          if (clearFields) {
            dispatch(clearFields())
          }
        }
      })
  }
}
export function fetchValidCallerIds(data) {
  console.log('data for fetchValidCallerIds', data)
  return (dispatch) => {
    callApi('company/fetchValidCallerIds', 'post', data)
      .then(res => {
        console.log('response from fetchValidCallerIds', res)
      })
  }
}
export function disconnect (data) {
  console.log('data for disconnect', data)
  return (dispatch) => {
    callApi('company/disconnect', 'post', data)
      .then(res => {
        console.log('response from disconnect', res)
        if (res.status === 'success') {
          dispatch(getAutomatedOptions())
          dispatch(getuserdetails())
        }
      })
  }
}
export function deleteWhatsApp (data, handleResponse) {
  console.log('data for deleteWhatsApp', data)
  return (dispatch) => {
    callApi('company/deleteWhatsAppInfo', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(getAutomatedOptions())
          dispatch(getuserdetails())
        }
        console.log('response from deleteWhatsApp', res)
        handleResponse(res)
      })
  }
}
export function updatePlatformWhatsApp (data, msg, clearFields, handleResponse) {
  console.log('data for updatePlatformWhatsApp', data)
  return (dispatch) => {
    callApi('company/updatePlatformWhatsApp', 'post', data)
      .then(res => {
        console.log('response from updatePlatformWhatsApp', res)
        if (res.status === 'success') {
          if (!data.changeWhatsAppFlockSend) {
            dispatch(getAutomatedOptions())
            dispatch(getuserdetails())
          }
          if (handleResponse) {
            handleResponse(res.payload)
          } else {
            msg.success('Saved Successfully')
          }
        } else {
          msg.error(res.payload)
          if (clearFields) {
            clearFields()
          }
        }
      })
  }
}

export function getWhatsAppMessageTemplates () {
  return (dispatch) => {
    callApi('company/getWhatsAppMessageTemplates')
      .then(res => {
        console.log('response from getWhatsAppMessageTemplates', res)
        dispatch(updateWhatsAppMessageTemplates(res.payload))
    })
  }
}

export function integrateZoom (cb) {
  return (dispatch) => {
    fetch('/auth/zoom', {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    })
      .then((res) => res.json())
      .then((res) => res)
      .then((res) => cb(res.payload))
  }
}

export function getZoomIntegrations () {
  return (dispatch) => {
    callApi('zoom/users')
      .then(res => {
        dispatch(updateZoomIntegrations(res.payload ? res.payload : []))
        // dispatch(updateZoomIntegrations([    
        //     {
        //       _id: '123',
        //       profilePic: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10217280192532174&height=50&width=50&ext=1596610613&hash=AeTfTwYDbHqEJfmf",
        //       firstName : "Anisha",
        //       lastName : "Chhatwani",
        //       connected: true
        //     },
        //     {
        //       _id: 'abc',
        //       profilePic: "",
        //       firstName : "Kibo",
        //       lastName : "Meeting",
        //       connected: true
        //     }
        //   ])
        // )
      })
  }
}

export function createZoomMeeting (data, callback) {
  return (dispatch) => {
    callApi('zoom/meetings', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export function getIntegrations () {
  return (dispatch) => {
    callApi('integrations')
      .then(res => {
        dispatch(showIntegrations(res.payload))
      })
  }
}
export function createIntegration () {
  console.log('createIntegration called')
  return (dispatch) => {
    callApi('sheetsIntegrations/auth')
      .then(res => {
      })
  }
}
export function updateIntegration (id, body) {
  return (dispatch) => {
    callApi(`integrations/update/${id}`, 'post', body)
      .then(res => {
        if (res.status === 'success') {
          dispatch(getIntegrations())
        }
      })
  }
}

export function updateAdvancedSettings (data, advancedSettings, msg) {
  return (dispatch) => {
    callApi('company/updateAdvancedSettings', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showAdvancedSettings(advancedSettings))
        } else {
          msg.error('Unable to update advanced settings')
        }
      })
  }
}

export function getAdvancedSettings () {
  return (dispatch) => {
    callApi('company/getAdvancedSettings')
      .then(res => {
        dispatch(showAdvancedSettings(res.payload))
      })
  }
}


export function loadcannedResponses () {
  return (dispatch) => {
    callApi('cannedResponses')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showcannedResponses(res.payload))
        } else {
          console.log('failed to fetch canned messages')
        }
      })
  }
}

export function createCannedResponses (data, cb) {
  return (dispatch) => {
    callApi('cannedResponses', 'post', data)
      .then(res => {
        if(res.status === 'success') {
        dispatch(loadcannedResponses())
        }
        cb(res)
     })
  }
}

export function updateCannedResponse (data, cb) {
  return (dispatch) => {
    callApi('cannedResponses/edit', 'post', data)
      .then(res => {
        cb(res)
        if (res.status === 'success') {
        dispatch(editCannedResponse(data))
        }
      })
  }
}
export function deleteCannedResponse (data, msg) {
  return (dispatch) => {
    callApi('cannedResponses/delete', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success(res.payload)
          if(res.status === 'success') {
            dispatch(RemoveCannedResponse(data))
            }
        } else {
          msg.error('Unable to delete canned Response')
        }
        // dispatch(showcannedResponses(res.payload))
      })
  }
}
