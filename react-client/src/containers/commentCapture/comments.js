// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchComments, fetchCommentReplies, saveCommentReplies
} from '../../redux/actions/commentCapture.actions'
import { formatDateTime } from '../../utility/utils'
import ReactPlayer from 'react-player'
import { getMetaUrls } from '../../utility/utils'

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
    let content = []
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
      <div className='row'>
        <div className='col-12' style={{marginBottom: '15px'}}>
          <h3 className='m-widget1__title'>Comments</h3>
        </div>
        <div className='col-12' style={{maxHeight: '500px', overflowY: 'scroll'}}>
        {
        (!this.props.comments || this.props.comments.length < 1) &&
        <span>This post has no comments</span>
        }
        {
          this.props.comments && this.props.comments.map((comment, index) => (
          <div className='m-widget3' key={index}>
            <div className='m-widget3__item' style={{borderBottom: 'none'}}>
              <div className='m-widget3__header'>
                <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
                  <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
                </div>
                <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
                  <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                    {comment.senderName}
                  </span>
                  {comment.commentPayload.map((component, index) => (
                    component.componentType === 'text'
                    ? <span style={{marginLeft: '5px'}} dangerouslySetInnerHTML={ this.handleText(component.text, index)} key={index}>
                    </span>
                    : component.componentType === 'image'
                    ? <span key={index} style={{marginLeft: '5px', display: 'block'}}>
                      <img alt='' style={{width: '150px', height: '150px'}} className='m-widget3__img' src={component.url}/> 
                    </span>
                    : component.componentType === 'gif'
                    ? <span key={index} style={{marginLeft: '5px',display: 'block'}}>
                      <img alt=''  style={{width: '150px', height: '150px'}} className='m-widget3__img' src={component.url}/> 
                    </span>
                    : component.componentType === 'video'
                    ? <span key={index}style={{marginLeft: '5px', display: 'block'}}>
                     <ReactPlayer
                      url={component.url}
                      controls
                      width='150px'
                      height='150px'
                      onPlay={this.onTestURLVideo(component.url)} />
                    </span>
                    :component.componentType === 'sticker'
                    ?<span key={index} style={{marginLeft: '5px',display: 'block'}}>
                        <img alt=''  style={{width: '150px', height: '150px'}} className='m-widget3__img' src={component.url}/> 
                    </span>
                    : <span key={index} style={{marginLeft: '5px'}}>
                      Component Not Supported 
                    </span>
                  ))                 
                  }
                  { (!this.props.currentPost.payload  || this.props.currentPost.payload.length < 1) && (!this.props.currentPost.post_id || this.props.currentPost.post_id === '') &&
                    <span key={index}style={{display: 'block', marginTop: '10px'}}>
                        <a href={comment.postFbLink} style={{marginLeft: '10px'}} >{comment.postFbLink}</a>
                    </span>
                  }
                  <br/>
                  <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                    {comment.dateTime ? formatDateTime(comment.datetime): formatDateTime(Date.now())}
                    {this.repliesCount(comment) < 1 && comment.childCommentCount > 0 && <span>
                    <a href="#/" style={{marginLeft: '10px'}} onClick={() => {this.getCommentReplies(comment._id, true)}}><i className='fa fa-reply' /> {comment.childCommentCount} {comment.childCommentCount > 1 ? 'replies' : 'reply' }</a>
                    </span>
                    }
                    { this.repliesCount(comment) > 0 && <span>
                    <a href="#/" style={{marginLeft: '10px'}} onClick={() => {this.hideCommentReplies(comment._id)}}><i className='fa fa-chevron-down' />Hide Replies</a>
                    </span>
                    }
                  </span>
                </div>
              </div>
            </div>
            { this.props.commentReplies && this.props.commentReplies.map((reply, index) => (
              reply.parentId === comment._id &&
              <div className='col-12'>
              <div className='m-widget3' style={{marginLeft: '25px'}}>
                <div className='m-widget3__item'>
                  <div className='m-widget3__header'>
                    <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
                      <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
                    </div>
                    <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
                      <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                        {reply.senderName}
                      </span>
                      {reply.commentPayload.map((component, index) => (
                        component.componentType === 'text'
                        ? <span style={{marginLeft: '5px'}} key={index}>
                          { component.text }
                        </span>
                        : component.componentType === 'image'
                        ? <span key={index} style={{marginLeft: '5px', display: 'block'}}>
                          <img alt='' style={{width: '150px', height: '150px'}} className='m-widget3__img' src={component.url}/> 
                        </span>
                        : component.componentType === 'gif'
                        ? <span key={index} style={{marginLeft: '5px',display: 'block'}}>
                          <img alt=''  style={{width: '150px', height: '150px'}} className='m-widget3__img' src={component.url}/> 
                        </span>
                        : component.componentType === 'video'
                        ? <span key={index}style={{marginLeft: '5px', display: 'block'}}>
                        <ReactPlayer
                          url={component.url}
                          controls
                          width='150px'
                          height='150px'
                          onPlay={this.onTestURLVideo(component.url)} />
                        </span>
                        : <span key={index} style={{marginLeft: '5px'}}>
                          Component Not Supported 
                        </span>
                      ))                 
                      }
                     <br/>
                      <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                        {reply.dateTime ? formatDateTime(reply.datetime): formatDateTime(Date.now())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
        {this.props.commentsCount && this.props.commentsCount > this.props.comments.length && <span>
          <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}} onClick={this.getComments}>View More Comments</a>
        </span>
        }
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
