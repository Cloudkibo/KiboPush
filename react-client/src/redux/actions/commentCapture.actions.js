import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
import { getAccountsUrl } from '../../utility/utils'
export const API_URL = '/api'

export function showAllPosts (data) {
  console.log('Data Fetched From posts', data)
  return {
    type: ActionTypes.SHOW_FACEBOOK_POSTS,
    data: data.reverse()
  }
}

export function showAllPostsAnalytics (data) {
  console.log('Data Fetched From PostsAnalytics', data)
  return {
    type: ActionTypes.SHOW_AllPostsAnalytics,
    data
  }
}

export function showSinglePostsAnalytics (data) {
  console.log('Data Fetched From single PostsAnalytics', data)
  return {
    type: ActionTypes.SHOW_SinglePostsAnalytics,
    data
  }
}
export function saveCurrentPost (data) {
  console.log('Actions for saving currentPost')
  return {
    type: ActionTypes.CURRENT_POST,
    data
  }
}

export function fetchAllPosts () {
  console.log('Actions for loading all facebook Posts')
  return (dispatch) => {
    callApi('post').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showAllPosts(res.payload))
      } else {
        console.log('Error in loading Posts', res)
      }
    })
  }
}
export function fetchPostsAnalytics () {
  console.log('Actions for loading all fetchPostsAnalytics')
  return (dispatch) => {
    callApi('post/fetchPostsAnalytics').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showAllPostsAnalytics(res.payload))
      } else {
        console.log('Error in fetchPostsAnalytics Posts', res)
        let data = {
          totalComments: 10,
          conversions: 10,
          totalRepliesSent: 10,
          waitingConversions: 10
        }
        dispatch(showAllPostsAnalytics(data))
      }
    })
  }
}

export function fetchCurrentPostsAnalytics (postId) {
  console.log('Actions for loading all fetchCurrentPostsAnalytics')
  return (dispatch) => {
    callApi(`post/singlePostsAnalytics${postId}`).then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showSinglePostsAnalytics(res.payload))
      } else {
        console.log('Error in singlePostsAnalytics ', res)
        let data = {
          totalComments: 20,
          conversions: 20,
          totalRepliesSent: 20,
          waitingConversions: 20,
          negativeMatch: 20
        }
        dispatch(showSinglePostsAnalytics(data))
      }
    })
  }
}
export function deletePost (id, msg) {
  console.log('Actions for deleting facebook Post')
  return (dispatch) => {
    callApi(`post/delete/${id}`, 'delete').then(res => {
      if (res.status === 'success') {
        msg.success('Post has been deleted')
        dispatch(fetchAllPosts(res.payload))
      } else {
        msg.error('Error in deleting post')
      }
    })
  }
}
export function createCommentCapture (data, msg, handleCreate) {
  console.log('data', data)
  return (dispatch) => {
    callApi('post/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success' && res.payload) {
          msg.success('Comment Capture saved successfully')
          if (res.payload.post_id && res.payload.payload && res.payload.payload.length > 0) {
            handleCreate(res.payload.post_id, true)
          } else {
            handleCreate(res.payload.post_id, false)
          }
        } else {
          if (res.status === 'failed' && res.payload) {
            msg.error(res.payload)
          } else {
            msg.error('Failed to create Comment Capture record')
          }
        }
      })
  }
}
export function editCommentCapture (data, msg, handleEdit) {
  console.log('edit Facebook Post', data)
  return (dispatch) => {
    callApi('post/edit', 'post', data)
      .then(res => {
        console.log('response from server', res)
        if (res.status === 'success') {
          msg.success('Changes saved successfully')
          if (handleEdit) {
            handleEdit()
          }
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to save changes. ${res.description}`)
          } else {
            msg.error('Failed to save changes')
          }
        }
      })
  }
}
export function uploadAttachment (fileData, handleUpload) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${getAccountsUrl()}/uploadFile`, {
      method: 'post',
      body: fileData,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('response', res)
      handleUpload(res, fileData)
    })
  }
}
