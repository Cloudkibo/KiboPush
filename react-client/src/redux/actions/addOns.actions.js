import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showAddOns (data) {
  return {
    type: ActionTypes.SHOW_ADD_ONS,
    data
  }
}

export function fetchAddOns () {
  return (dispatch) => {
    callApi('addOns').then(res => dispatch(showAddOns(res.payload)))
  }
}
