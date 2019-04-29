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

export function deleteMember (data, msg) {
  return (dispatch) => {
    callApi('company/removeMember', 'post', data)
    .then(res => {
      if (res.status === 'success') {
        msg.success('Member deleted successfully!')
        dispatch(loadMembersList())
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Failed to delete member. ${res.description}`)
        } else {
          msg.error('Failed to delete member')
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
