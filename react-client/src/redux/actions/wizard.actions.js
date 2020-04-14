import callApi from '../../utility/api.caller.service'
import {getuserdetails} from './basicinfo.actions'

export function updateChecks (data) {
  return (dispatch) => {
    callApi(`users/updateChecks`, 'post', data).then(res => {
        dispatch(getuserdetails())
    })
  }
}
