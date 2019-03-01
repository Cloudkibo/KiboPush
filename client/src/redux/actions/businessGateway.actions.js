import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function updateCurrentCustomersInfo (customerInfo, updateKey, updateValue) {
  return (dispatch) => {
    console.log('updateKey', updateKey)
    console.log('updateValue', updateValue)
    customerInfo[updateKey] = updateValue
    dispatch(saveCurrentCustomesrInfo(customerInfo))
  }
}
export function saveCurrentCustomesrInfo (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_CUSTOMERS_INFO,
    data
  }
}
export function setDefaultCustomersInfo (data) {
  return {
    type: ActionTypes.SET_DEFAULT_CUSTOMERS_INFO,
    data
  }
}
export function sendPushMessage (filedata, msg) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/businessGateway/uploadCSV`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('respone', res)
      if (res.status === 'success') {
        msg.success(res.description)
      } else {
        msg.error(res.description)
      }
    })
  }
}
