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
          <ReactPlayer
            url={this.props.videoUrl}
            controls
            width='200px'
            height='auto'
            onPlay
          />
          {
            this.props.buttons && this.props.buttons.length > 1 &&
            this.props.buttons.map((b, i) => (
              i > 0 &&
              <a href={b.url} target='_blank' rel='noopener noreferrer' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
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
