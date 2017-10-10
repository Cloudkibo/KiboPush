import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function sendresp (data) {
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}
export function saveFileForPhoneNumbers (file, invitationMessage) {
  console.log('file for phone numbers', file, invitationMessage)
  return (dispatch) => {
    callApi('growthtools/upload', 'post', file)
      .then(res => dispatch(sendresp(res.payload)))
  }
}
