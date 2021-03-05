import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchTemplates (body) {
  return (dispatch) => {
    callApi('supernumber/fetchTemplates', 'post', body).then(res => {
      console.log('response from fetchTemplates', res)
      if (res.status === 'success') {
        dispatch({
          type: ActionTypes.SHOW_COMMERCE_TEMPLATES,
          data: res.payload
        })
      }
    })
  }
}

export function fetchOrders (body) {
  return (dispatch) => {
    callApi('shopify/fetchOrders', 'post', body).then(res => {
      console.log('response from fetchOrders', res)
      if (res.status === 'success') {
        dispatch({
          type: ActionTypes.SHOW_ORDERS,
          data: res.payload
        })
      }
    })
  }
}
export function sendManualMessage (body, cb) {
  return (dispatch) => {
    callApi('supernumber/sendManualMessage', 'post', body).then(res => {
      console.log('response from sendManualMessage', res)
      if (cb) cb(res)
    })
  }
}
