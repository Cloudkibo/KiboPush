/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

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

export function updatePlanUniqueId(data) {
  return {
    type: ActionTypes.SET_ONBOARDING_PLAN_UNIQUE_ID,
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

export function setPlanUniqueId(planUniqueId) {
  return (dispatch) => {
    dispatch(updatePlanUniqueId(planUniqueId))
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

export function configureSMS(payload, msg) {
  return (dispatch) => {
    callApi('company/configureSMS', 'post', payload)
      .then(res => {
        if (res.status === 'success') {
          console.log('RESPONSE FROM CONFIGURE SMS', res)
        } else {
          if (msg) {
            msg.error(res.description || 'Failed to Configure')
          }
          console.log('ERROR FROM CONFIGURE SMS', res)
        }
      })
  }
}

export function connectSMS(payload, msg) {
  return (dispatch) => {
    callApi('company/connectSMS', 'post', payload)
      .then(res => {
        if (res.status === 'success') {
          console.log('RESPONSE FROM CONNECT SMS', res)
        } else {
          if (msg) {
            msg.error(res.payload || 'Failed to remove page')
          }
          console.log('ERROR FROM CONNECT SMS', res)
        }
      })
  }
}
