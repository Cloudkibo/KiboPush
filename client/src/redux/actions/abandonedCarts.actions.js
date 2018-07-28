/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePagesList (data) {
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  }
}

export function installShopifyApp (url, pageId) {
  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`/shopify`, 'post', {shop: url, pageId: pageId}).then(res => {
      console.log('res.payload', res)
      dispatch({type: 'SAMPLE'})
    })
  }
}
