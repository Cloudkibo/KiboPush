import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import request from 'superagent'
export const API_URL = '/api'

export function sendresp (data) {
  console.log('sendresp',data)
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}

export function saveFileForPhoneNumbers (filedata, invitationMessage) {
  return (dispatch) => {
    console.log('In dispatch', filedata.get('file'),invitationMessage)
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: {
        file : filedata,
        text : invitationMessage
      },
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('respone', res)
    })
  }
}
