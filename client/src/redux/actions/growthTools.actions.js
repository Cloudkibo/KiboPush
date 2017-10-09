import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'


export function saveFileForPhoneNumbers (file, invitationMessage) {
  console.log('file for phone numbers', file, invitationMessage)
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data: file
  }
}
