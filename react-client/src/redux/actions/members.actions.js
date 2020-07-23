/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateMembersList (data) {
  return {
    type: ActionTypes.LOAD_MEMBERS,
    data: data.payload
  }
}

export function memberSuccess (msg) {
  return {
    type: ActionTypes.MEMBERS_SUCCESS,
    successMessage: msg
  }
}

export function memberFailure (message) {
  return {
    type: ActionTypes.MEMBERS_FAILURE,
    errorMessage: message
  }
}

export function clearAlertMessages () {
  return {
    type: ActionTypes.CLEAR_MEMBERS_ALERT_MESSAGES
  }
}

export function loadMembersList () {
  // here we will fetch list of subscribers from endpoint

  return (dispatch) => {
    callApi('company/members').then(res => dispatch(updateMembersList(res)))
  }
}

export function disableMember (data, password,  msg) {
  return (dispatch) => {
    callApi('company/disableMember', 'post', {memberId: data.userId._id, password: password})
    .then(res => {
      if (res.status === 'success') {
        msg.success('Member has been disabled')
        dispatch(loadMembersList())
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Failed to disable member. ${res.description}`)
        } else {
          msg.error('Failed to disable member')
        }
      }
    })
  }
}
export function enableMember (data,  msg) {
  return (dispatch) => {
    callApi('company/enableMember', 'post', {memberId: data.userId._id})
    .then(res => {
      if (res.status === 'success') {
        msg.success(res.description)
        dispatch(loadMembersList())
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Failed to enable member. ${res.description}`)
        } else {
          msg.error('Failed to enable member')
        }
      }
    })
  }
}

export function updateMember (data) {
  console.log('data', data)
  return (dispatch) => {
    callApi('company/updateRole', 'post', data)
    .then(res => dispatch(loadMembersList()))
  }
}
