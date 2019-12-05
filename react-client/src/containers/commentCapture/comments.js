// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchComments, fetchCommentReplies, saveCommentReplies
} from '../../redux/actions/commentCapture.actions'
import { getMetaUrls } from '../../utility/utils'
import CommentBox from './CommentBox'
import ReplyBox from './ReplyBox'

class Comments extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.getComments = this.getComments.bind(this)
    this.getCommentReplies = this.getCommentReplies.bind(this)
    this.repliesCount = this.repliesCount.bind(this)
    this.showReplies = this.showReplies.bind(this)
    this.hideCommentReplies = this.hideCommentReplies.bind(this)
    this.handleText = this.handleText.bind(this)
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
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
  getComments () {
    this.props.fetchComments({
      first_page: false,
      last_id: this.props.comments ? this.props.comments[this.props.comments.length - 1]._id : 'none',
      number_of_records: 10,
      postId: this.props.currentPost._id,
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
                <h3 className='m-portlet__head-text'>Comments</h3>
              </div>
            </div>
          </div>
      <div className='m-portlet__body'>
        
      <div className='row'>
        <div className='col-12' style={{maxHeight: '500px', overflowY: 'scroll'}}>
        {
        (!this.props.comments || this.props.comments.length < 1) &&
        <span>This post has no comments</span>
        }
        {
          this.props.comments && this.props.comments.map((comment, index) => (
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
                <ReplyBox reply={reply}
                onTestURLVideo={this.onTestURLVideo}/>
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
        { this.props.comments && this.props.commentsCount > this.props.comments.length && <span>
          <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}} onClick={this.getComments}>View More Comments</a>
        </span>
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
    repliesCount: (state.postsInfo.repliesCount)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchComments,
    fetchCommentReplies,
    saveCommentReplies
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Comments)
