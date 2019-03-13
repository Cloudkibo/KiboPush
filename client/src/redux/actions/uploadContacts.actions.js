import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function uploadFile (filedata, msg, clearFields) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/contacts/uploadFile`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response from uploadFile', res)
      if (res.status === 'success') {
        msg.success('Contacts saved successfully')
        dispatch(clearFields())
      }
    })
  }
}

export function uploadNumbers (data, msg, clearFields) {
  return (dispatch) => {
    callApi('contacts/uploadNumbers', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          console.log('Response', res)
          msg.success('Contacts saved successfully')
          dispatch(clearFields())
        }
      }
    )
  }
}
