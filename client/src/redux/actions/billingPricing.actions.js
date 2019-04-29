import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchPlans (data) {
  return {
    type: ActionTypes.FETCH_ALL_PLANS,
    data
  }
}

export function fetchAllPlans () {
  return (dispatch) => {
    callApi('plans').then(res => {
      console.log('res', res)
      dispatch(fetchPlans(res.payload))
    })
  }
}

export function createPlan (data, msg) {
  console.log('data for createPlan', data)
  return (dispatch) => {
    callApi('plans/create', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Plan added successfully')
          dispatch(fetchAllPlans())
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function updatePlan (data, msg) {
  console.log('data for updatePlan', data)
  return (dispatch) => {
    callApi('plans/update', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Plan updated successfully')
          dispatch(fetchAllPlans())
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function migrate (data, msg) {
  console.log('data for migrateCompanies', data)
  return (dispatch) => {
    callApi('plans/migrateCompanies', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Comapnies migrated successfully')
          dispatch(fetchAllPlans())
        } else {
          msg.error(res.description)
        }
      })
  }
}
export function makeDefault (data, msg) {
  console.log('data for makeDefault', data)
  return (dispatch) => {
    callApi('plans/changeDefaultPlan', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Default plan changed successfully')
          dispatch(fetchAllPlans())
        } else {
          msg.error(res.description)
        }
      })
  }
}
export function deletePlan (id, msg) {
  console.log('id for delete', id)
  return (dispatch) => {
    callApi(`plans/delete/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Plan deleted successfully')
          dispatch(fetchAllPlans())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete Plan ${res.description}`)
          } else {
            msg.error('Failed to delete Plan')
          }
        }
      })
  }
}
