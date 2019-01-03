import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllURLs (data) {
  return {
    type: ActionTypes.SHOW_MESSENGER_REF_URLS,
    data
  }
}

export function fetchURLs () {
  console.log('in fetchURLs')
  return (dispatch) => {
    callApi('pageReferrals').then(res => {
      console.log('response from fetchURLs', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllURLs(res.payload))
      }
    })
  }
}
export function deleteURL (id, msg) {
  return (dispatch) => {
    callApi(`pageReferrals/${id}`, 'delete').then(res => {
      console.log('response from deleteURL', res)
      if (res.status === 'success') {
        msg.success('Messenger Ref URL has been deleted')
        dispatch(fetchURLs())
      } else {
        msg.error('Failed to delete Messenger Ref URL')
      }
    })
  }
}
