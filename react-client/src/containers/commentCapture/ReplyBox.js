/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { formatDateTime } from '../../utility/utils'
import ReactPlayer from 'react-player'

class ReplyBox extends React.Component {
  render () {
    return (
      <div className='m-widget3' style={{marginLeft: '25px'}}>
        <div className='m-widget3__item'>
          <div className='m-widget3__header'>
            <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
              <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
            </div>
            <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
              <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                {this.props.reply.senderName}
              </span>
              {this.props.reply.commentPayload.map((component, index) => (
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
                  onPlay={this.props.onTestURLVideo(component.url)} />
                </span>
                : <span key={index} style={{marginLeft: '5px'}}>
                  Component Not Supported 
                </span>
              ))                 
              }
            <br/>
              <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                {this.props.reply.datetime && formatDateTime(this.props.reply.datetime)}
              </span>
            </div>
          </div>
        </div>
      </div>
      )
    }
}

export default ReplyBox
