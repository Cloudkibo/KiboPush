/**
 * Created by sojharo on 08/01/2018.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateInvitationsList (data) {
  return {
    type: ActionTypes.LOAD_INVITATIONS,
    data: data.payload
  }
}

export function updateInvitation (data) {
  return {
    type: ActionTypes.ADD_INVITATION,
    data
  }
}

export function invitationSuccess (msg) {
  return {
    type: ActionTypes.INVITATION_SUCCESS,
    successMessage: msg
  }
}

export function invitationFailure (message) {
  return {
    type: ActionTypes.INVITATION_FAILURE,
    errorMessage: message
  }
}

export function clearAlertMessages () {
  return {
    type: ActionTypes.CLEAR_INVITATION_ALERT_MESSAGES
  }
}

export function loadInvitationsList () {
  // here we will fetch list of subscribers from endpoint

  return (dispatch) => {
    callApi('invitations').then(res => dispatch(updateInvitationsList(res)))
  }
}

export function addInvitation (data, handleResponse) {
  return (dispatch) => {
    callApi('company/invite', 'post', data)
    .then(res => {
      console.log('response from invitation', res)
      handleResponse(res)
    })
  }
}

export function cancelinvitation (data, msg) {
  return (dispatch) => {
    callApi('invitations/cancel', 'post', data)
    .then(res => {
      console.log('response from cancel invitation', res)
      if (res.status === 'success') {
        msg.success('Invitation Cancelled Successfully')
        dispatch(loadInvitationsList())
      } else {
        msg.error(res.description)
      }
    })
  }
}
