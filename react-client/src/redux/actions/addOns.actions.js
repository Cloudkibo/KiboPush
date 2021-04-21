import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showAddOns (data) {
  return {
    type: ActionTypes.SHOW_ADD_ONS,
    data
  }
}

export function showCompanyAddOns (data) {
  return {
    type: ActionTypes.SHOW_COMPANY_ADD_ONS,
    data
  }
}

export function fetchAddOns () {
  return (dispatch) => {
    callApi('addOns').then(res => dispatch(showAddOns(res.payload)))
  }
}

export function fetchCompanyAddOns (cb) {
  return (dispatch) => {
    callApi('addOns/company').then(res => {
      dispatch(showCompanyAddOns(res.payload))
      if (cb) cb(res)
    })
  }
}
