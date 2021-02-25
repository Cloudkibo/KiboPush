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

export function checkShopPermissions(callback) {
  return (dispatch) => {
    callApi('fbshops/checkFacebookPermissions')
      .then(res => {
        if (res.status === 'success') {
          // res.payload.permissionsGiven = true
          callback(res)
          dispatch({
            type: ActionTypes.CHECK_SHOP_PERMISSIONS,
            data: res.payload.permissionsGiven
          })
        }
      })
  }
}

export function fetchBusinessAccounts(callback) {
  return (dispatch) => {
    callApi('fbshops/fetchBusinessAccounts')
      .then(res => {
        // res.payload = [
        //   {id: '123', name: 'Anisha 1'},
        //   {id: '234', name: 'Anisha 2'}
        // ]
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.FETCH_BUSINESS_ACCOUNTS,
            data: res.payload
          })
        }
      })
  }
}

export function fetchCatalogs(businessAccount, cb) {
  return (dispatch) => {
    callApi(`fbshops/fetchCatalogs/${businessAccount}`)
      .then(res => {
        cb(res)
      })
  }
}


export function installShopify (data) {
  return (dispatch) => {
    callApi('shopify', 'post', data)
      .then(res => {
        window.location.replace(res.installUrl)
      })
  }
}
