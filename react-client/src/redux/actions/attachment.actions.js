import { getAccountsUrl } from '../../utility/utils'
import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'

export function uploadAttachment(filedata, handleFunction) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${getAccountsUrl()}/uploadFile`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      handleFunction(res)
    })
  }
}

export function handleAttachment(data, callback) {
  return (dispatch) => {
    callApi(`attachment/handleUrl`, 'post', data)
      .then(res => {
        console.log('response from handleAttachment', res)
        callback(res)
      })
  }
}
