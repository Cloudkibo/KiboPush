import * as ActionTypes from '../constants/constants'

export function postsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_FACEBOOK_POSTS:
      return Object.assign({}, state, {
        posts: action.data
      })
    case ActionTypes.CURRENT_POST:
      return Object.assign({}, state, {
        currentPost: action.data
      })
    case ActionTypes.SECOND_REPLY: 
      return Object.assign({}, state, {
        secondReply: action.data
      })
    default:
      return state
  }
}
