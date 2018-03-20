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

export function deleteMember (data) {
  return (dispatch) => {
    callApi('company/removeMember', 'post', data)
    .then(res => dispatch(loadMembersList()))
  }
}

export function updateMember (data) {
  return (dispatch) => {
    callApi('company/updateRole', 'post', data)
    .then(res => dispatch(loadMembersList()))
  }
}
