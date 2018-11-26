import callApi from '../../utility/api.caller.service'

export function requestMessengerCode (data) {
  console.log('data in requestMessengerCode', data)
  return (dispatch) => {
    callApi('messengerCode/generateMessengerCode', 'post', data)
      .then(res => {
        console.log('response from requestMessengerCode', res)
      })
  }
}
