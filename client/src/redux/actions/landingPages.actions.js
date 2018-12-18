import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllLandingPages (data) {
  return {
    type: ActionTypes.SHOW_LANDING_PAGES,
    data
  }
}

export function fetchLandingPages () {
  return (dispatch) => {
    callApi('landingPage').then(res => {
      console.log('response from fetchLandingPages', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllLandingPages(res.payload))
      }
    })
  }
}
export function deleteLandingPage (id, msg) {
  return (dispatch) => {
    callApi(`landingPage/${id}`, 'delete').then(res => {
      console.log('response from deleteLandingPage', res)
      if (res.status === 'success') {
        msg.success('Landing Page has been deleted')
        dispatch(fetchLandingPages())
      } else {
        msg.error('Failed to delete Landing Page')
      }
    })
  }
}
export function createLandingPage (data, msg) {
  console.log('date for createLandingPage', data)
  return (dispatch) => {
    callApi('landingPage', 'post', data)
    .then(res => {
      console.log('response from createLandingPage', res)
      if (res.status === 'success') {
        msg.success('Landing Page saved successfully')
      } else {
        msg.error('failed to save landing page')
      }
    })
  }
}
