import * as ActionTypes from '../constants/constants'

const initialState = {
  permissions: []
}

export function permissionsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_PERMISSIONS:
      return Object.assign({}, state, {
        permissions: action.data
      })

    default:
      return state
  }
}
