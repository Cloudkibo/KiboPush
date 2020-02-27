import React from 'react'
import PropTypes from 'prop-types'

class LeftChatItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
        {
          this.props.index === 0
          ? <div className='m-messenger__datetime'>
            {this.props.displayDate(this.props.message.datetime)}
          </div>
          : index > 0 && this.props.showDate(this.props.lastChatDatetime, this.props.message.datetime) &&
          <div className='m-messenger__datetime'>
            {this.props.displayDate(this.props.message.datetime)}
          </div>
        }
        <div style={{minWidth: '200px', maxWidth: '200px'}} className='m-messenger__message m-messenger__message--in'>
          <div className='m-messenger__message-pic'>
            <img src={this.props.activeSession.profilePic} alt='' />
          </div>
          <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            {/* components */}
          </div>
        </div>
      </div>
    )
  }
}

LeftChatItem.propTypes = {
  'index': PropTypes.number.isRequired,
  'message': PropTypes.object.isRequired,
  'showDate': PropTypes.func.isRequired,
  'displayDate': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired
}

export default LeftChatItem
