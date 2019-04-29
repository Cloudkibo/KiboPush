import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchUsage (data) {
  return {
    type: ActionTypes.FETCH_ALL_USAGE,
    data
  }
}

export function fetchAllUsage (plan) {
  console.log('plan', plan)
  return (dispatch) => {
    callApi(`usage/${plan}`).then(res => {
      console.log('res', res)
      dispatch(fetchUsage(res.payload))
    })
  }
}
export function updateUsage (data, msg) {
  console.log('data for updateUsage', data)
  return (dispatch) => {
    callApi(`usage/update`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Usage item updated successfully')
          dispatch(fetchAllUsage(data.planId))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function addUsage (data, msg) {
  console.log('data for addUsage', data)
  return (dispatch) => {
    callApi(`usage/create`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Usage item added successfully')
          dispatch(fetchAllUsage(data.planId))
        } else {
          msg.error(res.description)
        }
      })
  }
}
