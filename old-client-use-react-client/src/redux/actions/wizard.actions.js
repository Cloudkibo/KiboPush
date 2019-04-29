import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function updateChecks (data) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', data).then(res => {
        // dispatch(editBroadcast(res.payload));
    })
  }
}
