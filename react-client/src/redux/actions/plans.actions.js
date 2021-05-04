/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePlans(data) {
  const enterprisePlan = data.find((item) => item.unique_ID === 'plan_D')
  const index = data.findIndex((item) => item.unique_ID === 'plan_D')
  data.splice(index, 1)
  data = data.sort((a, b) => {
    if (a.amount < b.amount) {
      return -1
    } else if (a.amount > b.amount) {
      return 1
    }
    return 0
  })
  data.push(enterprisePlan)
  return {
    type: ActionTypes.LOAD_PLANS_LIST,
    data
  }
}

export function loadPlans(platform, cb) {
  return (dispatch) => {
    callApi(`plans/${platform}`).then(res => {
      dispatch(updatePlans(res.payload))
      if (cb) cb(res)
    })
  }
}
