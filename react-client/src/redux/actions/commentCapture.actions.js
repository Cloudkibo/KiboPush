import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
import { getAccountsUrl } from '../../utility/utils'
export const API_URL = '/api'

export function showAllPosts (data) {
  console.log('Data Fetched From posts', data)
  return {
    type: ActionTypes.SHOW_FACEBOOK_POSTS,
    posts: data.posts ? data.posts : [],
    postsCount: data.count
  }
}

export function saveCommentReplies (data) {
  return {
    type: ActionTypes.SAVE_COMMENT_REPLIES,
    data: data
  }
}

export function removePost(data) {
  return {
    type: ActionTypes.REMOVE_COMMENT_REPLIES,
    data: data
  }
}
export function saveComments (data) {
  return {
    type: ActionTypes.SAVE_COMMENTS,
    data: data
  }
}
export function showAllComments (data) {
  console.log('Data Fetched From comments', data)
  return {
    type: ActionTypes.SHOW_POST_COMMENTS,
    comments: data.comments,
    commentCount: data.count
  }
}
export function showGlobalPosts (data) {
  return {
    type: ActionTypes.SHOW_GLOBAL_POSTS,
    globalPosts: data.posts,
    postsAfter: data.after
  }
}
export function showSearchResults (data) {
  return {
    type: ActionTypes.SHOW_SEARCH_RESULTS,
    searchResult: data.comments,
    searchCount: data.count
  }
}
export function resetSearchResult (data) {
  return {
    type: ActionTypes.RESET_SEARCH_RESULTS,
    searchResult: data,
    searchCount: data
  }
}
export function showPostData (data) {
  console.log('Data fetched for post', data)
  return {
    type: ActionTypes.SHOW_POST_CONTENT,
    postContent: data
  }
}
export function resetComments (data) {
  console.log('Data Fetched From comments', data)
  return {
    type: ActionTypes.RESET_COMMENTS,
    data: null
  }
}
export function showAllReplies (data) {
  console.log('Data Fetched From replies', data)
  return {
    type: ActionTypes.SHOW_COMMENTS_REPLIES,
    commentReplies: data.replies,
    repliesCount: data.count
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
  console.log('Data Fetched From PostsAnalytics', data)
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

export function fetchAllPosts (data) {
  console.log('Actions for loading all facebook Posts')
  return (dispatch) => {
    callApi('post', 'post', data)
    .then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showAllPosts(res.payload))
      } else {
        console.log('Error in loading Posts', res)
      }
    })
  }
}
export function fetchPostContent (post_id) {
  console.log('Fetching post data')
  return (dispatch) => {
    callApi(`post/fetchPostData/${post_id}`)
    .then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showPostData(res.payload))
      } else {
        console.log('Unable to fetch post data')
      }
    })
  }
}
export function fetchExportCommentsData (data,msg,handle) {
  console.log('Fetching export comments data')
  return (dispatch) => {
    callApi(`post/fetchAllComments`, 'post', data)
    .then(res => {
      if (res.status === 'success' && res.payload) {
        handle((res.payload))
      } else {
        msg.error('Unable to fetch data')
      }
    })
  }
}
export function fetchPostsAnalytics () {
  console.log('Actions for loading all fetchPostsAnalytics')
  return (dispatch) => {
    callApi('post/fetchPostsAnalytics').then(res => {
      if (res.status === 'success' && res.payload && res.payload.length > 0) {
        dispatch(showAllPostsAnalytics(res.payload[0]))
      }
      else if (res.status === 'success') {
        dispatch(showAllPostsAnalytics(res.payload))
      }
      else {
        console.log('Error in fetchPostsAnalytics Posts', res)
      }
    })
  }
}
export function fetchComments (data) {
  console.log('Actions for loading all post comments')
  return (dispatch) => {
    callApi('post/getComments', 'post', data)
      .then(res => {
        if (res.status === 'success' && res.payload) {
          dispatch(showAllComments(res.payload))
        } else {
          console.log('Error in fetching comments', res)
        }
    })
  }
}
export function fetchCommentReplies (data) {
  console.log('Actions for loading all post comment replies')
  return (dispatch) => {
    callApi('post/getRepliesToComment', 'post', data)
      .then(res => {
        if (res.status === 'success' && res.payload) {
          dispatch(showAllReplies(res.payload))
        } else {
          console.log('Error in fetching comment replies', res)
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
        dispatch(removePost(id))
        dispatch(fetchPostsAnalytics(res.payload))
      } else {
        msg.error('Error in deleting post')
      }
    })
  }
}
export function searchComments (data, msg) {
  console.log('Actions for searching comments')
  return (dispatch) => {
    callApi(`post/filterComments`, 'post', data).then(res => {
      if (res.status === 'success') {
        if (res.payload.comments.length < 1) {
          msg.error('No search results found')
        } else {
         dispatch(showSearchResults(res.payload))
        }
      } else {
        msg.error('Unable to fetch search results')
      }
    })
  }
}
export function createCommentCapture (data, msg, handleCreate) {
  console.log('data', data)
  return (dispatch) => {
    callApi('post/create', 'post', data)
      .then(res => {
        if (res.status === 'success' && res.payload) {
          msg.success('Comment Capture saved successfully')
          if (res.payload.post_id && res.payload.payload && res.payload.payload.length > 0) {
            handleCreate(res.payload.post_id, true)
          } else {
            handleCreate(res.payload.post_id, false)
          }
        } else {
          if (res.status === 'failed' && res.payload) {
            try {
              let payload = JSON.parse(res.payload)
              if (payload.code === 506) {
                msg.error(payload.error_user_msg)
              } else {
                msg.error('Failed to create Comment Capture record')
              }
            } catch (e) {
                msg.error(res.payload)
            }
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
export function fetchPosts (data) {
  console.log('Actions for fetching posts')
  return (dispatch) => {
    callApi(`post/fetchGlobalPostData`, 'post', data)
    .then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showGlobalPosts(res.payload))
      } else {
        console.log('Error in fetching posts ', res)
      }
    })
    .catch(err => {
      console.log('Error in fetching posts ', err)
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
