import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchFeautures (data) {
  return {
    type: ActionTypes.FETCH_ALL_FEATURES,
    data
  }
}

export function fetchAllFeatures (plan) {
  console.log('plan', plan)
  return (dispatch) => {
    callApi(`planPermissions/${plan}`).then(res => {
      console.log('res', res)
      dispatch(fetchFeautures(res.payload))
    })
  }
}
export function updateFeatures (plan, data, msg) {
  console.log('data for updatePermissions', data)
  return (dispatch) => {
    callApi(`planPermissions/update`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Features updated successfully')
          dispatch(fetchAllFeatures(plan))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function addFeature (data, msg, plan) {
  console.log('data for addPermission', data)
  return (dispatch) => {
    callApi(`planPermissions/create`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Feature added successfully')
          if (plan !== '') {
            dispatch(fetchAllFeatures(plan))
          }
        } else {
          msg.error(res.description)
        }
      })
  }
}
