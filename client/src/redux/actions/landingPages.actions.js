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
export function createFacebookPost (data, msg, handleCreate) {
  console.log('data', data)
  return (dispatch) => {
    callApi('post/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success' && res.payload) {
          msg.success('Posted on Facebook successfully')
          handleCreate()
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to post on facebook. ${res.description}`)
          } else {
            msg.error('Failed to post on facebook')
          }
        }
      })
  }
}
