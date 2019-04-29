import * as ActionTypes from '../constants/constants'

const initialState = {
  plans: []
}

export function billingPricingInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_PLANS:
      return Object.assign({}, state, {
        plans: action.data
      })

    default:
      return state
  }
}
