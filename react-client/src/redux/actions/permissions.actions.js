import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchPermissions (data) {
  return {
    type: ActionTypes.FETCH_ALL_PERMISSIONS,
    data
  }
}

export function fetchAllPermissions (role) {
  console.log('role', role)
  return (dispatch) => {
    callApi(`permissions/${role}`).then(res => {
      console.log('res', res)
      dispatch(fetchPermissions(res.payload))
    })
  }
}

export function updatePermissions (role, data, msg) {
  console.log('data for updatePermissions', data)
  return (dispatch) => {
    callApi(`permissions/update`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Permissions updated successfully')
          dispatch(fetchAllPermissions(role))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function addPermission (data, msg, role) {
  console.log('data for addPermission', data)
  return (dispatch) => {
    callApi(`permissions/create`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Permission added successfully')
          if (role !== '') {
            dispatch(fetchAllPermissions(role))
          }
        } else {
          msg.error(res.description)
        }
      })
  }
}
