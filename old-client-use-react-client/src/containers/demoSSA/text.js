/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Text extends React.Component {
  render () {
    return (
      <div className='m-messenger__message-body'>
        <div className='m-messenger__message-arrow' />
        <div className='m-messenger__message-content'>
          <div style={{width: '200px'}} className='m-messenger__message-text'>
            {this.props.text}
          </div>
          {
            this.props.buttons && this.props.buttons.length > 0 &&
            this.props.buttons.map(b => (
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

export default Text
