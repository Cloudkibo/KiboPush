/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class QuickReply extends React.Component {
  render () {
    return (
      <div className='m-messenger__message-body'>
        <div className='m-messenger__message-arrow' />
        <div className='m-messenger__message-content'>
          <div style={{width: '200px'}} className='m-messenger__message-text'>
            {this.props.text}
          </div>
          <div>
            {
              this.props.quick_replies && this.props.quick_replies.length > 0 &&
              this.props.quick_replies.map(b => (
                <button onClick={() => { this.props.clickQuickReply(b.title) }} style={{borderColor: '#36a3f7', margin: '3px'}} type='button' className='btn m-btn--pill btn-outline-info btn-sm'>
                  {b.title}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default QuickReply
