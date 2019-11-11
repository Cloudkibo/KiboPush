/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Image extends React.Component {
  render () {
    return (
      <div className='m-messenger__message-body'>
        <div className='m-messenger__message-arrow' />
        <div className='m-messenger__message-content'>
          <a href={this.props.url} target='_blank' rel='noopener noreferrer'>
            <img
              alt=''
              src={this.props.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
          </a>
        </div>
      </div>
    )
  }
}

export default Image
