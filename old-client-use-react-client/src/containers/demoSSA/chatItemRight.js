/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class ChatItemRight extends React.Component {
  render () {
    return (
      <div style={{minWidth: '200px'}} className='m-messenger__message m-messenger__message--out'>
        <div className='m-messenger__message-body'>
          <div className='m-messenger__message-arrow' />
          <div className='m-messenger__message-content'>
            <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
              {this.props.message.text}
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
