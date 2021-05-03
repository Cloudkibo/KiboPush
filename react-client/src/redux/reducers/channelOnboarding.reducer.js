import * as ActionTypes from '../constants/constants'

export function channelOnboarding (state = [], action) {
  switch (action.type) {
    case ActionTypes.SET_ONBOARDING_PLANID:
      return Object.assign({}, state, {
        planId: action.data
      })
    case ActionTypes.SET_ONBOARDING_PLAN_NAME:
      return Object.assign({}, state, {
        planName: action.data
      })
    case ActionTypes.SET_ONBOARDING_PLAN_UNIQUE_ID:
      return Object.assign({}, state, {
        planUniqueId: action.data
      })
    case ActionTypes.SET_ONBOARDING_PLATFORM:
      return Object.assign({}, state, {
        platform: action.data
      })
    case ActionTypes.SET_ONBOARDING_STRIPE_TOKEN:
      return Object.assign({}, state, {
        stripeToken: action.data
      })
    case ActionTypes.SET_ONBOARDING_NUMBER_DETAILS:
      return Object.assign({}, state, {
        numberDetails: action.data
      })
    default:
      return state
  }
}
