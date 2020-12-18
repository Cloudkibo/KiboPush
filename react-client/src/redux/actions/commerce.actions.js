import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchShopifyStore() {
  return (dispatch) => {
    callApi('shopify/fetchStore')
      .then(res => {
        if (res.status === 'success' && res.payload) {
          let data = res.payload
          data.storeType = 'shopify'
          dispatch({
            type: ActionTypes.FETCH_STORE,
            data
          })
        }
      })
  }
}

export function fetchBigCommerceStore() {
  return (dispatch) => {
    callApi('bigcommerce/fetchStore')
      .then(res => {
        if (res.status === 'success' && res.payload) {
          let data = res.payload
          data.storeType = 'bigcommerce'
          dispatch({
            type: ActionTypes.FETCH_STORE,
            data
          })
        }
      })
  }
}