import * as ActionTypes from '../constants/constants'

export function feedsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_RSS_FEEDS:
      return Object.assign({}, state, {
        rssFeeds: action.rssFeeds,
        count: action.count,
      })

    default:
      return state
  }
}
