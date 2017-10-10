import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function saveFileForPhoneNumbers (file, invitationMessage) {
  console.log('file for phone numbers', file, invitationMessage)
  return (dispatch) => {
    callApi('polls/create', 'post', data)
      .then(res => dispatch(createPoll(res.payload)))
  }
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data: file
  }
}
