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

export function deleteRssFeed (id) {
  return (dispatch) => {
    callApi(`rssFeeds/`, 'delete', {_id: id})
      .then(res => dispatch(fetchRssFeed()))
  }
}

export function fetchRssFeed () {
  console.log('function for fetching rss feeds')
  return (dispatch) => {
    callApi(`rssFeeds/`)
      .then(res => {
        console.log('response from fetching rss feeds', res)
        if (res.status === 'success') {
          dispatch(showRssFeeds(res.payload))
        } else {
          dispatch(showRssFeeds([]))
        }
      })
  }
}
