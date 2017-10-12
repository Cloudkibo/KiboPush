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
export function saveFileForPhoneNumbers (files, invitationMessage) {

  var file = files[0]
/*  var fileData = new FormData()
  fileData.append('file', file)
  fileData.append('name', file.name)
  fileData.append('filetype', file.type)
  fileData.append('filesize', file.size)
  console.log('saveFileForPhoneNumbers',fileData.get('file') ,invitationMessage)*/

  return (dispatch) => {
    // eslint-disable-next-line no-undef
    /*fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: {
        file : fileData,
        text : invitationMessage
      },
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response', res.status)
    })*/
    var req = request.post(`${API_URL}/growthtools/upload`);
    req.attach(file.name, file);
    req.field('text', invitationMessage);
    req.end((err,res) => {
      if (err) {
        var data = {err: true, status:res.status , description :  res.statusText}
      }  else {
        console.log('response', res, err)
        var data = {err:false , status: res.status , description :  res.statusText}
      }
        dispatch(sendresp(data))
    })
  }
}
