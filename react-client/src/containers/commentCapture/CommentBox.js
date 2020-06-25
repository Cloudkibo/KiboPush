/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { formatDateTime } from '../../utility/utils'
import ReactPlayer from 'react-player'

class CommentBox extends React.Component {
  render () {
    return (
      <div className='m-widget3'>
        <div className='m-widget3__item' style={{borderBottom: 'none'}}>
          <div className='m-widget3__header'>
            <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
              <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
            </div>
            <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
              <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                {this.props.comment.senderName}
              </span>
              {this.props.comment.commentPayload.map((component, index) => (
                component.componentType === 'text'
                ? <span style={{marginLeft: '5px'}} dangerouslySetInnerHTML={ this.props.handleText(component.text, index)} key={index}>
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
                  onPlay={this.props.onTestURLVideo(component.url)} />
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
                {this.props.comment.datetime && formatDateTime(this.props.comment.datetime) }
                {this.props.repliesCount(this.props.comment) < 1 && this.props.comment.childCommentCount > 0 && <span>
                <span style={{cursor: 'pointer', color: '#5867dd', textDecoration: 'underline', marginLeft: '10px'}} onClick={() => {this.props.getCommentReplies(this.props.comment._id, true)}}><i className='fa fa-reply' /> {this.props.comment.childCommentCount} {this.props.comment.childCommentCount > 1 ? 'replies' : 'reply' }</span>
                </span>
                }
                { this.props.repliesCount(this.props.comment) > 0 && <span>
                <span style={{cursor: 'pointer', color: '#5867dd', textDecoration: 'underline', marginLeft: '10px'}} onClick={() => {this.props.hideCommentReplies(this.props.comment._id)}}><i className='fa fa-chevron-down' />Hide Replies</span>
                </span>
                }
              </span>
            </div>
          </div>
        </div>
      </div>
      )
    }
}

export default CommentBox
