import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchStore() {
  return (dispatch) => {
    callApi('shopify/fetchStore')
      .then(res => {
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.FETCH_SHOPIFY_STORE,
            data: res.payload
          })
        }
      })
  }
}