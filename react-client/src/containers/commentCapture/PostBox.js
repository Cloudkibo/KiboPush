/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { handleDate } from '../../utility/utils'
import Dotdotdot from 'react-dotdotdot'


/* this.props.style must be any of these
  band
  success
  danger
  accent
 */

class PostBox extends React.Component {
  render () {
    return (
      <div className='m-widget3'>
        <div className='m-widget3__item' style={{width: 'auto',height: '150px',borderBottom: 'none',border:'1px solid #36a3f7', borderRadius: '25px', padding: '15px' }}>
          <div className='m-widget3__header'>
            <div className='m-widget3__user-img'>
              <img alt='' className='m-widget3__img' src={this.props.page.pagePic}/>
            </div>
            <div className='m-widget3__info'>
              <span className='m-widget3__username'>
                {this.props.page.pageName}
              </span>
              <br/>
              <span className='m-widget3__time'>
                {handleDate(this.props.post.datetime ? this.props.post.datetime: '')}
              </span>
            </div>
          </div>
          <div className='m-widget3__body' style={{marginLeft: '5px'}}>	
            { this.props.post.message && 
            <Dotdotdot clamp={1}>
              <p className='widget3__text'>
                {this.props.post.message}
              </p>
            </Dotdotdot>
            }
            { (!this.props.post.message || this.props.post.message === '') && this.props.post.attachments && 
            <p className='widget3__text'>
              Post has attachments
            </p>
            }
          </div>
          { this.props.getComments 
          ?<div style={{float: 'right', display: 'inline'}}>
            { this.props.commentsCount(this.props.post) > 0 &&
              <span style={{cursor: 'pointer', color: '#5867dd', marginRight: '5px', textDecoration: 'underline'}} onClick={() => {this.props.hideComments(this.props.post)}}><i className='fa fa-chevron-down' />Hide Comments</span>
            }
            {this.props.commentsCount(this.props.post) < 1 && this.props.post.commentsCount > 0 && <a href='#/' style={{marginRight: '5px', textDecoration: 'underline'}} onClick={() => this.props.getComments(this.props.post.postId, true)}>{this.props.post.commentsCount} Comments</a>}
            <a style={{textDecoration: 'underline'}} target='_blank' rel='noopener noreferrer' href={`https://facebook.com/${this.props.post.postId}`}>View on Facebook</a>
          </div>
          :<div style={{float: 'right', display: 'inline'}}>
            <a style={{textDecoration: 'underline'}} target='_blank' rel='noopener noreferrer' href={this.props.post.postLink}>View on Facebook</a>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default PostBox
