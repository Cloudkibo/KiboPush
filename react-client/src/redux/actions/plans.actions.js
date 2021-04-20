/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePlans(data) {
  return {
    type: ActionTypes.LOAD_PLANS_LIST,
    data
  }
}

export function loadPlans(platform) {
  return (dispatch) => {
    callApi(`plans/${platform}`).then(res => {
      console.log('res.payload from load plans', res)
      dispatch(updatePlans(res.payload))
    })
  }
}
