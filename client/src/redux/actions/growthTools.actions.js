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
  console.log('saveFileForPhoneNumbers', file[0], invitationMessage)
  var fileData = new FormData()
  fileData.append('file', file[0])
  fileData.append('filename', file[0].name)
  fileData.append('filetype', file[0].type)
  fileData.append('filesize', file[0].size)

  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: {
        file: fileData,
        text : invitationMessage
      },
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response', res.status)
    })
  }
}
