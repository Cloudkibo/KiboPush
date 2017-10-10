import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function sendresp (data) {
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}
export function saveFileForPhoneNumbers (file, invitationMessage) {
  console.log('saveFileForPhoneNumbers', file)
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: file,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response', res.status)
    })
  }
}
