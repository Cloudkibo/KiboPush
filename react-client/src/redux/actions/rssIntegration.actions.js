import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'


export function showNewsFeeds (data) {
  return {
    type: ActionTypes.SHOW_RSS_FEEDS,
    rssFeeds: data.rssFeeds,
    count: data.count
  }
}
export function saveNewsPages (data) {
  return {
    type: ActionTypes.SAVE_NEWS_PAGES,
    newsPages: data,
  }
}
export function showRssFeedPosts (data) {
  return {
    type: ActionTypes.SHOW_RSS_FEED_POSTS,
    feedPosts: data.rssFeedPosts,
    postsCount: data.count
  }
}

export function saveCurrentFeed (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_FEED,
    currentFeed: data,
  }
}

export function deleteNewsFeed (id, msg, resetFilters, type) {
  return (dispatch) => {
    var fetchData = {last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: '',
      status_value: '',
      integrationType: type
     }
    callApi(`newsSections/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Feed has been deleted successfully')
          dispatch(fetchNewsFeed(fetchData))
          resetFilters()
        } else {
          msg.error('Unable to delete Feed')
        }
      })

  }
}
export function checkSubscriptionPermissions (handle) {
  return (dispatch) => {
    callApi(`newsSections/checkSMP`, 'get')
      .then(res => {
        if (res.status === 'success') {
          handle(res.payload)
        } else {
          var permissions = []
          handle(permissions)
        }
      })
  }
}
export function fetchNewsFeed (data) {
  console.log('function for fetching news feeds', data)
  return (dispatch) => {
    callApi(`newsSections/fetchFeeds`, 'post', data)
      .then(res => {
        console.log('response from fetching news feeds', res)
        if (res.status === 'success') {
          dispatch(showNewsFeeds(res.payload))
        } else {
          dispatch(showNewsFeeds({rssFeeds: [], count: 0}))
        }
      })
  }
}

export function fetchFeedPosts (data) {
  console.log('function for fetching feed posts', data)
  return (dispatch) => {
    callApi(`newsSections/rssFeedPosts`, 'post', data)
      .then(res => {
        console.log('response from fetching news feeds', res)
        if (res.status === 'success') {
          dispatch(showRssFeedPosts(res.payload))
        } else {
          dispatch(showRssFeedPosts({feedPosts: [], count: 0}))
        }
      })
  }
}

export function createNewsFeed (data, msg, handle, toggleLoader) {
  console.log('function for creating news feeds', data)
  return (dispatch) => {
      var fetchData = {last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: '',
      status_value: '',
      type_value: '',
      integrationType: data.integrationType
    }
    callApi(`newsSections/create`, 'post', data)
      .then(res => {
        console.log('response from creating news feeds', res)
        if (res.status === 'success') {
          msg.success('Feed saved successfully')
          dispatch(fetchNewsFeed(fetchData))
          handle(res.payload)
        } else {
          if (toggleLoader) {
            toggleLoader()
          }
          msg.error(res.payload)
        }
      })
  }
}
export function previewNewsFeed (data, msg, toggleLoader) {
  console.log('function for previewing news feeds', data)
  return (dispatch) => {
    callApi(`newsSections/preview`, 'post', data)
      .then(res => {
        if (toggleLoader) {
          toggleLoader()
        }
        console.log('response from previewing news feeds', res)
        if (res.status === 'success') {
          msg.success('Preview message sent successfully to your messenger')
        } else {
          msg.error(JSON.stringify(res.payload))
        }
      })
  }
}
export function updateNewsFeed (data, msg, fetchFeeds, toggleLoader) {
  console.log('function for updating news feeds', data)
  var fetchData = {last_id: 'none',
    number_of_records: 10,
    first_page: 'first',
    search_value: '',
    status_value: '',
    type_value: '',
    integrationType: data.updatedObject.integrationType
  }
  return (dispatch) => {
    callApi(`newsSections/edit`, 'post', data)
      .then(res => {
        if (toggleLoader) {
          toggleLoader()
        }
        console.log('response from editing news feeds', res)
        if (res.status === 'success') {
          if (fetchFeeds) {
            dispatch(fetchNewsFeed(fetchData))
          }
          msg.success('Feed has been updated successfully')
        } else {
          if (res.payload) {
            msg.error(res.payload)
          } else {
            msg.error('Failed to update feed ')
          }
        }
      })
  }
}
