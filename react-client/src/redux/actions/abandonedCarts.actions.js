/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateStoreList (data) {
  return {
    type: ActionTypes.UPDATE_STORE_LIST,
    data
  }
}

export function updateOrderList (data) {
  return {
    type: ActionTypes.UPDATE_ORDER_LIST,
    data
  }
}

export function updateAbandonedList (data) {
  return {
    type: ActionTypes.UPDATE_ABANDONED_LIST,
    data
  }
}

export function updateSentCount (data) {
  return {
    type: ActionTypes.UPDATE_SENT_COUNT,
    data
  }
}

export function updateAnalytics (data) {
  return {
    type: ActionTypes.UPDATE_ANALYTICS,
    data
  }
}

export function getShopifyStores () {
  return (dispatch) => {
    callApi('abandonedCarts/getStores').then(res => {
      console.log('Shopify Stores', res)
      dispatch(updateStoreList(res.payload))
    })
  }
}

export function getAbandonedCarts () {
  return (dispatch) => {
    callApi('abandonedCarts/abandonedCheckouts').then(res => {
      console.log('Abandoned Checkouts', res.payload)
      dispatch(updateAbandonedList(res.payload))
    })
  }
}

export function getOrders () {
  return (dispatch) => {
    callApi('abandonedCarts/getOrders').then(res => {
      console.log('response from getOrders', res)
      dispatch(updateOrderList(res.payload))
    })
  }
}

export function getAnalytics () {
  return (dispatch) => {
    callApi('abandonedCarts/sendAnalytics').then(res => {
      if(res.status === "success"){
        console.log('Abandoned Analytics', res.payload)
        dispatch(updateAnalytics(res.payload))
      }
    })
  }
}

export function updateStoreStatus (data, msg) {
  return (dispatch) => {
    callApi('abandonedCarts/updateStatusStore', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          // Add logic to display success Message
          console.log('updated successfully: ' + JSON.stringify(res))
          msg.success('Status updated successfully')
        }
      })
  }
}

export function updateStoreInfo (id, data, msg) {
  console.log('data for updateStoreInfo', data)
  console.log('data for updateStoreInfo', id)
  return (dispatch) => {
    callApi(`abandonedCarts/updateStoreInfo/${id}`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          // Add logic to display success Message
          console.log('updated successfully: ' + JSON.stringify(res))
          msg.success('Settings updated successfully')
        }
      })
  }
}

export function sendAbandonedCartNow (data, msg) {
  return (dispatch) => {
    callApi('abandonedCarts/sendCheckout', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          // Add logic to display success Message: res.payload.id
          console.log('updated successfully: ' + JSON.stringify(res))
          msg.success('Abandoned Cart Sent Successfully')
          dispatch(updateSentCount(res.payload.id))
        } else if (res.status === 'failed') {
          msg.error('Abandoned Cart Sent Failed')
        }
      })
  }
}
