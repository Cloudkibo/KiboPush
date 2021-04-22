/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'

export function updatePlanId(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_PLANID,
    data
  }
}

export function updatePlanName(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_PLAN_NAME,
    data
  }
}

export function updatePlatform(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_PLATFORM,
    data
  }
}

export function updateStripeToken(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_STRIPE_TOKEN,
    data
  }
}

export function updateNumberDetails(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_NUMBER_DETAILS,
    data
  }
}

export function setPlanId(planId) {
  return (dispatch) => {
    dispatch(updatePlanId(planId))
  }
}

export function setPlanName(planName) {
  return (dispatch) => {
    dispatch(updatePlanName(planName))
  }
}

export function setOnboardingPlatform(platform) {
  return (dispatch) => {
    dispatch(updatePlatform(platform))
  }
}

export function setOnboardingStripeToken(token) {
  return (dispatch) => {
    dispatch(updateStripeToken(token))
  }
}

export function setOnboardingNumberDetails(payload) {
  return (dispatch) => {
    dispatch(updateNumberDetails(payload))
  }
}
