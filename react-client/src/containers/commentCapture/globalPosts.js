// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchComments, fetchCommentReplies, saveCommentReplies, saveComments, fetchPosts
} from '../../redux/actions/commentCapture.actions'
import PostBox from './PostBox'
import CommentBox from './CommentBox'
import { getMetaUrls } from '../../utility/utils'
import ReplyBox from './ReplyBox'

class GlobalPosts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      page: this.props.pages.filter((page) => page._id === this.props.currentPost.pageId)[0]
    }
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.getComments = this.getComments.bind(this)
    this.getCommentReplies = this.getCommentReplies.bind(this)
    this.repliesCount = this.repliesCount.bind(this)
    this.showReplies = this.showReplies.bind(this)
    this.hideCommentReplies = this.hideCommentReplies.bind(this)
    this.handleText = this.handleText.bind(this)
    this.fetchPosts = this.fetchPosts.bind(this)
    this.commentsCount = this.commentsCount.bind(this)
    this.showComments = this.showComments.bind(this)
    this.hideComments = this.hideComments.bind(this)
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  fetchPosts() {
    this.props.fetchPosts({
      pageId: this.props.currentPost.pageId,
      number_of_records: 10,
      after: this.props.postsAfter
     })
  }
  handleText(text, index) {
    let urls = getMetaUrls(text)
    if (urls && urls.length > 0) {
      for (let i = 0; i < urls.length && i < 10; i++) {
        text = text.replace(urls[i], '<a href='+ urls[i]+'>'+ urls[i]+ '</a>')
      }
    }
    return {__html:text}
  } 

   repliesCount (comment) {
    var repliesCount = 0
    if (this.props.commentReplies) {
      for (var i = 0; i < this.props.commentReplies.length; i++) {
        if (this.props.commentReplies[i].parentId === comment._id) {
          repliesCount = repliesCount + 1
        }
      }
    }
    return repliesCount
  }
  commentsCount (post) {
    var commentsCount = 0
    if (this.props.comments) {
      for (var i = 0; i < this.props.comments.length; i++) {
        if (this.props.comments[i].postFbId === post.postId) {
          commentsCount = commentsCount + 1
        }
      }
    }
    return commentsCount
  }
  hideComments (post) {
    var comments = []
    if (this.props.comments) {
      for (var i = 0; i < this.props.comments.length; i++) {
        if (this.props.comments[i].postFbId !== post.postId) {
          comments.push(this.props.comments[i])
        }
      }
    }
    this.props.saveComments(comments)
  }
  showReplies (comment) {
    var showReplies = false
    if (this.props.commentReplies) {
      for (var i = 0; i < this.props.commentReplies.length; i++) {
        if (this.props.commentReplies[i].parentId === comment._id) {
          showReplies = true
          break
        }
      }
    }
    return showReplies
  }
  showComments (post) {
    var showComments = false
    if (this.props.comments) {
      for (var i = 0; i < this.props.comments.length; i++) {
        if (this.props.comments[i].postFbId === post.postId) {
          showComments = true
          break
        }
      }
    }
    return showComments
  }
  hideCommentReplies (commentId) {
    var replies = []
    if (this.props.commentReplies) {
      for (var i = 0; i < this.props.commentReplies.length; i++) {
        if (this.props.commentReplies[i].parentId !== commentId) {
            replies.push(this.props.commentReplies[i])
        }
      }
    }
    this.props.saveCommentReplies(replies)
  }
  getComments (postFbId, isFirstPage) {
    this.props.fetchComments({
      first_page: isFirstPage,
      last_id: !isFirstPage && this.props.comments && this.props.comments.length > 0 ? this.props.comments[this.props.comments.length - 1]._id : 'none',
      number_of_records: 10,
      postId: this.props.currentPost._id,
      post_id: postFbId,
      sort_value: -1
    })
  }
  getCommentReplies (commentId, isFirstPage) {
    this.props.fetchCommentReplies({
      first_page: isFirstPage,
      last_id: this.props.commentReplies && !isFirstPage ? this.props.commentReplies[this.props.commentReplies.length - 1]._id : 'none',
      number_of_records: 10,
      commentId: commentId,
      sort_value: -1
    })
  }

  render () {
    return (
      <div className='m-portlet m-portlet--full-height '>
        <div className='m-portlet__head'>
          <div className='m-portlet__head-caption'>
            <div className='m-portlet__head-title'>
              <h3 className='m-portlet__head-text'>All Posts</h3>
            </div>
          </div>
          <div className='m-portlet__head-tools'>
            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled={this.props.globalPosts && this.props.globalPosts.length === 0} onClick={this.props.toggleOffCanvas}>
              <span>
                <i className='fa fa-more-v2' />
                <span>
                  Apply Filters
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className='m-portlet__body' style={{maxHeight: '500px', overflowY: 'scroll'}}>      
          <div className='row'>
            <div className='col-8'>
            { this.props.globalPosts && this.props.globalPosts.map((post, index) => (
              <div key={index}>
               <PostBox 
                  commentsCount={this.commentsCount}
                  hideComments= {this.hideComments}
                  getComments={this.getComments}
                  post={post}
                  page={this.state.page}
               />
              { this.props.comments && this.props.comments.map((comment, index) => (
              comment.postFbId === post.postId &&
              <div key={index}>
                <CommentBox 
                  repliesCount={this.repliesCount}
                  getCommentReplies= {this.getCommentReplies}
                  hideCommentReplies={this.hideCommentReplies}
                  handleText = {this.handleText}
                  comment={comment}
                  onTestURLVideo={this.onTestURLVideo}
                />
                { this.props.commentReplies && this.props.commentReplies.map((reply, index) => (
                reply.parentId === comment._id &&
                <div index={index}>
                  <ReplyBox reply={reply}/>
                </div>
                ))
              }
                { this.showReplies(comment) && (comment.childCommentCount - this.repliesCount(comment) > 0) &&
                  <div className='col-12'>
                    <span>
                      <a href="#/" style={{marginLeft: '75px', fontSize:'0.9rem'}} onClick={() => this.getCommentReplies(comment._id, false)}><i className='fa fa-reply' /> {(comment.childCommentCount -  this.repliesCount(comment) > 1) ? 'View ' + comment.childCommentCount -  this.repliesCount(comment) + ' more replies': 'View 1 more reply'}</a>
                    </span>
                  </div>
                }
              </div>
              ))
            }
            { this.showComments(post) && (post.commentsCount - this.commentsCount(post) > 0) &&
            <div className='col-12'>
              <span>
                <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}} onClick={() => this.getComments(post.postId, false)}>View More Comments</a>
              </span>
            </div>
            }
            </div>
            ))
          } { this.props.postsAfter && this.props.postsAfter !== '' &&
            <div className='col-12'>
              <span>
                <a href="#/" onClick={this.fetchPosts}>Show More Posts</a>
              </span>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    comments: (state.postsInfo.comments),
    commentReplies: (state.postsInfo.commentReplies),
    currentPost: (state.postsInfo.currentPost),
    commentsCount: (state.postsInfo.commentsCount),
    repliesCount: (state.postsInfo.repliesCount),
    globalPosts: (state.postsInfo.globalPosts),
    postsAfter: (state.postsInfo.postsAfter),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchComments,
    fetchCommentReplies,
    saveCommentReplies,
    saveComments,
    fetchPosts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GlobalPosts)
