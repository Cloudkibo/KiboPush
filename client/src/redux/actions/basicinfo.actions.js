import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'

export function setBrowserName (data) {
  return {
    type: ActionTypes.LOAD_BROWSER_NAME,
    data
  }
}
export function showuserdetails (data) {
  // NOTE: don't remove following auth method call
  console.log('user details', data)
  if (data && data.permissionsRevoked) {
    return {
      type: ActionTypes.PERMISSION_ERROR,
      data
    }
  } else {
    auth.putUserId(data._id)
    return {
      type: ActionTypes.LOAD_USER_DETAILS,
      data
    }
  }
}

export function updateKeys (data) {
  return {
    type: ActionTypes.LOAD_KEYS,
    captchaKey: data.captchaKey,
    stripeKey: data.stripeKey
  }
}

export function showUpdatedUserDetails (data) {
  // NOTE: don't remove following auth method call
  auth.putUserId(data._id)
  return {
    type: ActionTypes.LOAD_UPDATED_USER_DETAILS,
    data
  }
}

export function storeFbAppId (data) {
  // NOTE: don't remove following auth method call
  return {
    type: ActionTypes.STORE_FB_APP_ID,
    data
  }
}

export function storeAdminSubscriptions (data) {
  // NOTE: don't remove following auth method call
  return {
    type: ActionTypes.STORE_ADMIN_SUB_ID,
    data
  }
}

export function setBrowserVersion (data) {
  return {
    type: ActionTypes.LOAD_BROWSER_VERSION,
    data
  }
}

export function setSocketStatus (data) {
  return {
    type: ActionTypes.SET_SOCKET_STATUS,
    data
  }
}

export function getuserdetails () {
  return (dispatch) => {
    callApi('users').then(res => dispatch(showuserdetails(res.payload)))
  }
}

export function getFbAppId () {
  return (dispatch) => {
    callApi('users/fbAppId').then(res => dispatch(storeFbAppId(res.payload)))
  }
}

export function getAdminSubscriptions () {
  return (dispatch) => {
    callApi('adminsubscriptions').then(res => dispatch(storeAdminSubscriptions(res.payload)))
  }
}
export function updateMode (data) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('users/updateMode', 'post', data).then(res => {
      console.log('response from updateMode', res)
      if (res.status === 'success') {
        dispatch(showUpdatedUserDetails(res.payload))
      }
    })
  }
}

export function updatePlan (data, msg) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('company/updatePlan', 'post', data).then(res => {
      console.log('response from updatePlan', res)
      if (res.status === 'success') {
        msg.success('Plan updated successfully')
        dispatch(getuserdetails())
      } else {
        msg.error(res.description)
      }
    })
  }
}

export function updateCard (data) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('company/setCard', 'post', data).then(res => {
      console.log('response from updatePlan', res)
      if (res.status === 'success') {
        dispatch(getuserdetails())
      }
    })
  }
}

export function getKeys () {
  return (dispatch) => {
    callApi('company/getKeys').then(res => dispatch(updateKeys(res)))
  }
}
