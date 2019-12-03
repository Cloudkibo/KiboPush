import * as ActionTypes from '../constants/constants'

export function postsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_FACEBOOK_POSTS:
      return Object.assign({}, state, {
        posts: action.posts,
        postsCount: action.postsCount
      })
    case ActionTypes.SHOW_POST_COMMENTS:
      return Object.assign({}, state, {
        comments: state.comments? [...state.comments, ...action.comments] : action.comments,
        commentsCount: action.commentCount
      })
    case ActionTypes.SHOW_COMMENTS_REPLIES:
      return Object.assign({}, state, {
        commentReplies: state.commentReplies ? [...state.commentReplies, ...action.commentReplies] : action.commentReplies,
        repliesCount: action.repliesCount
      })
    case ActionTypes.SAVE_COMMENT_REPLIES:
      return Object.assign({}, state, {
        commentReplies: action.data
      })
    case ActionTypes.RESET_COMMENTS:
      return Object.assign({}, state, {
        commentReplies: action.data,
        comments: action.data,
        commentsCount:action.data,
        repliesCount: action.data
      })
    case ActionTypes.CURRENT_POST:
      return Object.assign({}, state, {
        currentPost: action.data
      })
      case ActionTypes.SHOW_AllPostsAnalytics:
      return Object.assign({}, state, {
        allPostsAnalytics: action.data
      })
      case ActionTypes.SHOW_SinglePostsAnalytics:
      return Object.assign({}, state, {
        CurrentPostsAnalytics: action.data
      })
    default:
      return state
  }
}
