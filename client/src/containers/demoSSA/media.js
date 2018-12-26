/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import ReactPlayer from 'react-player'

class Media extends React.Component {
  render () {
    return (
      <div className='m-messenger__message-body'>
        <div className='m-messenger__message-arrow' />
        <div className='m-messenger__message-content'>
          <div className='m-messenger__message-username'>
            Bot replied:
          </div>
          <ReactPlayer
            url={this.props.videoUrl}
            controls
            width='200px'
            height='auto'
            onPlay
          />
          {
            this.props.buttons && this.props.buttons.length > 1 &&
            this.props.buttons.splice(0, 1).map(b => (
              <a href={b.url} target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                {b.title}
              </a>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Media
