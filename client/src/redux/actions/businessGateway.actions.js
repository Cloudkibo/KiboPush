import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import { removeButtonOldurl } from './actions.utility'
export const API_URL = '/api'

export function updateCurrentCustomersInfo (customerInfo, updateKey, updateValue, enableSave) {
  return (dispatch) => {
    console.log('updateKey', updateKey)
    console.log('updateValue', updateValue)
    customerInfo[updateKey] = updateValue
    dispatch(saveCurrentCustomersInfo(customerInfo))
    if (enableSave) {
      enableSave(customerInfo)
    }
  }
}
export function saveCurrentCustomersInfo (data) {
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
export function sendPushMessage (filedata, pushMessage, msg) {
  var messageData = removeButtonOldurl({payload: pushMessage})
  if (filedata) {
    filedata.append('message', JSON.stringify(messageData.payload))
  }
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
