import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'


export function showRssFeeds (data) {
  return {
    type: ActionTypes.SHOW_RSS_FEEDS,
    rssFeeds: data.rssFeeds,
    count: data.count
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

export function deleteRssFeed (id, msg, resetFilters) {
  return (dispatch) => {
    var fetchData = {last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      search_value: '',
      status_value: '',
     }
    callApi(`rssFeeds/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Rss feed has been deleted successfully')
          dispatch(fetchRssFeed(fetchData))
          resetFilters()
        } else {
          msg.error('Unable to delete Rss feed')
        }      
      })

  }
}

export function fetchRssFeed (data) {
  console.log('function for fetching rss feeds', data)
  return (dispatch) => {
    callApi(`rssFeeds/fetchFeeds`, 'post', data)
      .then(res => {
        console.log('response from fetching rss feeds', res)
        if (res.status === 'success') {
          dispatch(showRssFeeds(res.payload))
        } else {
          dispatch(showRssFeeds({rssFeeds: [], count: 0}))
        }
      })
  }
}

export function fetchFeedPosts (data) {
  console.log('function for fetching feed posts', data)
  return (dispatch) => {
    callApi(`rssFeeds/rssFeedPosts`, 'post', data)
      .then(res => {
        console.log('response from fetching rss feeds', res)
        if (res.status === 'success') {
          dispatch(showRssFeedPosts(res.payload))
        } else {
          dispatch(showRssFeedPosts({feedPosts: [], count: 0}))
        }
      })
  }
}

export function createRssFeed (data, msg, handle) {
  console.log('function for creating rss feeds', data)
  return (dispatch) => {
    callApi(`rssFeeds/create`, 'post', data)
      .then(res => {
        console.log('response from creating rss feeds', res)
        if (res.status === 'success') {
          msg.success('Rss feed saved successfully')
          handle(res.payload)
        } else {
          msg.error(res.payload)
        }
      })
  }
}
export function updateFeed (data, msg, fetchFeeds) {
  console.log('function for updating rss feeds', data)
  var fetchData = {last_id: 'none',
    number_of_records: 10,
    first_page: 'first',
    search_value: '',
    status_value: '',
  }
  return (dispatch) => {
    callApi(`rssFeeds/edit`, 'post', data)
      .then(res => {
        console.log('response from editing rss feeds', res)
        if (res.status === 'success') {
          if (fetchFeeds) {
            dispatch(fetchRssFeed(fetchData))
          }
          msg.success('Feed has been updated successfully')
        } else {
          msg.error('Failed to update feed ')
        }
      })
  }
}
