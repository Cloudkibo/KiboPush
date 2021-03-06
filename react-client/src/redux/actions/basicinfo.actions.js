import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'

export function setIsMobile(data) {
  return {
    type: ActionTypes.SET_IS_MOBILE,
    data
  }
}

export function setBrowserName(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_NAME,
    data
  }
}

export function fetchPlan(data) {
  return {
    type: ActionTypes.FETCH_PLAN,
    data
  }
}

export function saveEnvironment (data) {
  return {
    type: ActionTypes.CURRENT_ENVIRONMENT,
    data
  }
}


export function showuserdetails(data) {
  // NOTE: don't remove following auth method call
  auth.putUserId(data.user._id)
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
    data: data
  }
}

export function showDetailUser(data) {
  return {
    type: ActionTypes.SHOW_USER_DETAIL_AUTOMATE_OPTION,
    data
  }
}

export function showAutomatedOptions(data) {
  console.log(data)
  return {
    type: ActionTypes.GET_AUTOMATED_OPTIONS,
    data
  }
}

export function updateKeys(data) {
  return {
    type: ActionTypes.LOAD_KEYS,
    captchaKey: data.captchaKey,
    stripeKey: data.stripeKey
  }
}

export function showUpdatedUserDetails(data, user) {
  user.uiMode = data
  return {
    type: ActionTypes.LOAD_UPDATED_USER_DETAILS,
    data
  }
}

export function storeFbAppId(data) {
  // NOTE: don't remove following auth method call
  return {
    type: ActionTypes.STORE_FB_APP_ID,
    data
  }
}

export function storeAdminSubscriptions(data) {
  // NOTE: don't remove following auth method call
  return {
    type: ActionTypes.STORE_ADMIN_SUB_ID,
    data
  }
}

export function setBrowserVersion(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_VERSION,
    data
  }
}

export function setSocketStatus(data) {
  return {
    type: ActionTypes.SET_SOCKET_STATUS,
    data
  }
}

export function getuserdetails(joinRoom, cb) {
  return (dispatch) => {
    callApi('users').then(res => {
      if (res.status === 'Unauthorized') {
        auth.logout()
      } else {
        if (joinRoom) {
          if (res.payload.user && res.payload.user.companyId) {
            joinRoom(res.payload.user.companyId)
          } else {
            joinRoom(res.payload.companyId)
          }
        }
        if (res.status === 'success' && cb) {
          cb(res.payload)
        }
        dispatch(showuserdetails(res.payload))
      }
    })
  }
}

export function updatePicture(data, callback) {
  return (dispatch) => {
    callApi('updatePicture', 'post', data, 'accounts')
      .then(res => {
        if (res.status === 'success') {
          dispatch(getuserdetails())
          if (callback) {
            callback(res.payload)
          }
        }
      })
  }
}

export function getAutomatedOptions() {
  return (dispatch) => {
    callApi('company/getAutomatedOptions').then(res => {
    console.log('getAutomatedOptions response')
    dispatch(showAutomatedOptions(res.payload))
    })
  }
}

export function getFbAppId() {
  return (dispatch) => {
    callApi('users/fbAppId').then(res => dispatch(storeFbAppId(res.payload)))
  }
}

export function getAdminSubscriptions() {
  return (dispatch) => {
    callApi('adminsubscriptions').then(res => {
      console.log('response from adminsubscriptions', res)
      dispatch(storeAdminSubscriptions(res.payload))
    })
  }
}

export function fetchAdminSubscriptions(body, callback) {
  return (dispatch) => {
    callApi('adminsubscriptions/fetch', 'post', body).then(res => {
      console.log('response from adminsubscriptions', res)
      callback(res.payload)
      dispatch(storeAdminSubscriptions(res.payload))
    })
  }
}

export function updateMode(data, user) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('users/changeUIMode', 'post', data).then(res => {
      console.log('response from updateMode', res)
      if (res.status === 'success') {
        dispatch(showUpdatedUserDetails(res.payload, user))
      }
    })
  }
}

export function updatePlan(data, msg) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('company/updatePlan', 'post', data).then(res => {
      console.log('response from updatePlan', res)
      if (res.status === 'success') {
        msg.success('Plan updated successfully')
        dispatch(fetchPlan('success'))
        dispatch(getuserdetails())
      } else {
        msg.error(res.description || 'Failed to update plan')
      }
    })
  }
}

export function updateCard(data, msg) {
  console.log('data for updateMode', data)
  return (dispatch) => {
    callApi('company/setCard', 'post', data).then(res => {
      console.log('response from updatePlan', res)
      if (res.status === 'success') {
        msg.success('Card added successfully')
        dispatch(getuserdetails())
      } else {
        msg.error(res.description)
      }
    })
  }
}

export function getKeys() {
  return (dispatch) => {
    callApi('company/getKeys').then(res => dispatch(updateKeys(res)))
  }
}

export function validateUserAccessToken(cb) {
  return (dispatch) => {
    callApi('users/validateUserAccessToken').then(res => {
      cb(res)
    })
  }
}

export function isFacebookConnected(cb) {
  return (dispatch) => {
    callApi('users/validateFacebookConnected').then(res => {
      cb(res)
    })
  }
}
export function updateShowIntegrations(data, browserHistory) {
  return (dispatch) => {
    callApi('users/updateShowIntegrations', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(getuserdetails())
      } else {
        console.log('Failed to update show integrations!')
      }
      if (browserHistory) {
        browserHistory.push({
          pathname: '/dashboard',
          state: { loadScript: true }
        })
      }
    })
  }
}

export function disconnectFacebook(callback) {
  return (dispatch) => {
    callApi('users/disconnectFacebook').then(res => {
      if (res.status === 'success') {
        dispatch(getuserdetails())
      } else {
        console.log('Failed to update show integrations!')
      }
      if (callback) {
        callback(res)
      }
    })
  }
}

export function updatePlatform(data, handleChangePlatform) {
  return (dispatch) => {
    callApi('users/updatePlatform', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(getuserdetails())
        if (handleChangePlatform) {
          handleChangePlatform(data.platform)
        }
      } else {
        console.log('Failed to update platform', res)
      }
    })
  }
}

export function logout(cb) {
  return (dispatch) => {
    console.log('called logout')
    callApi('users/logout').then(res => {
      if (res.status === 'success') {
        console.log('send logout successfully', res)
        cb()
      } else {
        console.log('Failed to update platform', res)
      }
    })
  }
}
