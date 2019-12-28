import * as ActionTypes from '../constants/constants'

export function feedsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_RSS_FEEDS:
      return Object.assign({}, state, {
        rssFeeds: action.rssFeeds,
        count: action.count,
      })
    case ActionTypes.SHOW_RSS_FEED_POSTS:
      return Object.assign({}, state, {
        feedPosts: action.feedPosts,
        postsCount: action.postsCount,
      })

    default:
      return state
  }
}
