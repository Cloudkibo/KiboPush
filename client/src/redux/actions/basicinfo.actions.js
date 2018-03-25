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
  auth.putUserId(data._id)
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
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
