import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showAllPosts (data) {
  console.log('Data Fetched From posts', data)
  return {
    type: ActionTypes.SHOW_FACEBOOK_POSTS,
    data
  }
}

export function fetchAllPosts () {
  console.log('Actions for loading all facebook Posts')
  return (dispatch) => {
    callApi('posts').then(res => {
      if (res.status === 'success' && res.payload) {
        // dispatch(showAllPosts(res.payload))
      } else {
        console.log('Error in loading Posts', res)
      }
      dispatch(showAllPosts([]))
    })
  }
}

export function createFacebookPost (data) {
  console.log('data', data)
  return (dispatch) => {
    callApi('post/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          console.log('response', res)
        }
      })
  }
}
