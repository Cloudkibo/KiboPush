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

export function updateAbandonedList (data) {
  return {
    type: ActionTypes.UPDATE_ABANDONED_LIST,
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

export function updateStoreStatus (data, msg) {
  return (dispatch) => {
    callApi('abandonedCarts/updateStatusStore', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          // Add logic to display success Message
          console.log('updated successfully: ' + JSON.stringify(res))
          msg.info('Status updated successfully')
        }
      })
  }
}
