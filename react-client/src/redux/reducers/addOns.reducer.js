import * as ActionTypes from '../constants/constants'

export function addOnsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_ADD_ONS:
      return Object.assign({}, state, {
        addOns: action.data
      })

    case ActionTypes.SHOW_COMPANY_ADD_ONS:
      return Object.assign({}, state, {
        companyAddOns: action.data
      })

    default:
      return state
  }
}
