import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import request from 'superagent'
export const API_URL = '/api'

export function sendresp (data) {
  console.log('sendresp', data)
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}

export function saveFileForPhoneNumbers (filedata) {
  return (dispatch) => {
    console.log('In dispatch', filedata.get('file'))
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('respone', res)
      var data = {status: res.status, description: res.description}
      console.log(data)
      dispatch(sendresp(data))
    })
  }
}
