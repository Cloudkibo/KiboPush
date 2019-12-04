// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchComments, fetchCommentReplies, saveCommentReplies, saveComments
} from '../../redux/actions/commentCapture.actions'
import { formatDateTime } from '../../utility/utils'
import ReactPlayer from 'react-player'
import { getMetaUrls } from '../../utility/utils'
import { handleDate } from '../../utility/utils'
import Dotdotdot from 'react-dotdotdot'

class Comments extends React.Component {
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
  getComments (postFbId) {
    this.props.fetchComments({
      first_page: true,
      last_id: this.props.comments && this.props.comments.length > 0 ? this.props.comments[this.props.comments.length - 1]._id : 'none',
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
        </div>
        <div className='m-portlet__body' style={{maxHeight: '500px', overflowY: 'scroll'}}>      
          <div className='row'>
            <div className='col-8'>
            { this.props.globalPosts && this.props.globalPosts.map((post, index) => (
              <div className='m-widget3'>
                <div className='m-widget3__item' key={index} style={{width: 'auto',height: '150px',borderBottom: 'none',border:'1px solid #36a3f7', borderRadius: '25px', padding: '15px' }}>
                  <div className='m-widget3__header'>
                    <div className='m-widget3__user-img'>
                      <img alt='' className='m-widget3__img' src={this.state.page.pagePic}/>
                    </div>
                    <div className='m-widget3__info'>
                      <span className='m-widget3__username'>
                        {this.state.page.pageName}
                      </span>
                      <br/>
                      <span className='m-widget3__time'>
                        {handleDate(post.datetime)}
                      </span>
                    </div>
                  </div>
                  <div className='m-widget3__body' style={{marginLeft: '5px'}}>	
                    { post.message && 
                    <Dotdotdot clamp={1}>
                      <p className='widget3__text'>
                        {post.message}
                      </p>
                    </Dotdotdot>
                    }
                    { (!post.message || post.message === '') && post.attachments && 
                    <p className='widget3__text'>
                      Post has attachments
                    </p>
                    }
                  </div>
                  <div style={{float: 'right', display: 'inline'}}>
                    { this.commentsCount(post) > 0 &&
                     <a href="#/" style={{marginRight: '5px'}} onClick={() => {this.hideComments(post)}}><i className='fa fa-chevron-down' />Hide Comments</a>
                    }
                    {this.commentsCount(post) < 1 && post.commentsCount > 0 && <a href='#/' style={{marginRight: '5px'}} onClick={() => this.getComments(post.postId)}>{post.commentsCount} Comments</a>}
                    <a href={`https://facebook.com/${post.postId}`}>View on Facebook</a>
                  </div>
              </div>
              { this.props.comments && this.props.comments.map((comment, index) => (
              comment.postFbId === post.postId &&
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
                    <br />
                    <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                        {comment.datetime && formatDateTime(comment.datetime) }
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
                          {reply.datetime && formatDateTime(reply.datetime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              }
              </div>
              ))
            }
            {/* View more comments*/ }
            </div>
            ))
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
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchComments,
    fetchCommentReplies,
    saveCommentReplies,
    saveComments
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Comments)
