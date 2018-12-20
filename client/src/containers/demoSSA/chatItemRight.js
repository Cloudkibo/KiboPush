/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class ChatItemRight extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{minWidth: '200px'}} className='m-messenger__message m-messenger__message--out'>
        <div className='m-messenger__message-body'>
          <div className='m-messenger__message-arrow' />
          <div className='m-messenger__message-content'>
            <div className='m-messenger__message-username'>
              You wrote:
            </div>
            <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
              I want to know about my requirement benefits.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItemRight)
