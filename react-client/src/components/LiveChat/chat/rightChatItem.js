import React from 'react'
import PropTypes from 'prop-types'

// components
import TEXT from '../messages/text'
import IMAGE from '../messages/image'
import AUDIO from '../messages/audio'
import VIDEO from '../messages/video'
import FILE from '../messages/file'
import POLL from '../messages/poll'
import SURVEY from '../messages/survey'
import LIST from '../messages/list'

class RightChatItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.getMessage = this.getMessage.bind(this)
  }

  getRepliedByMsg () {
    let message = ''
    if (
      !this.props.activeSession.replied_by ||
      this.props.activeSession.replied_by.id === this.props.user._id
    ) {
      message = 'You replied:'
    } else {
      message = `${this.props.activeSession.replied_by.name} replied:`
    }
    return message
  }

  getMessage () {
    const type = this.props.message.payload.componentType
    if (type === 'text') {
      return (
        <TEXT
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (['image', 'sticker', 'gif', 'thumbsUp'].includes(type)) {
      return (
        <IMAGE
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'audio') {
      return (
        <AUDIO
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'video') {
      return (
        <VIDEO
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'file') {
      return (
        <FILE
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'poll') {
      return (
        <POLL
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'survey') {
      return (
        <SURVEY
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else if (type === 'list') {
      return (
        <LIST
          message={this.props.message}
          repliedByMessage={this.getRepliedByMsg()}
          seenElement={this.props.seenElement}
        />
      )
    } else {
      return (<div />)
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
          : this.props.index > 0 && this.props.showDate(this.props.previousMessage.datetime, this.props.message.datetime) &&
          <div className='m-messenger__datetime'>
            {this.props.displayDate(this.props.message.datetime)}
          </div>
        }
        <div style={{minWidth: '200px', maxWidth: '200px'}} className='m-messenger__message m-messenger__message--out'>
          <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            {this.getMessage()}
          </div>
        </div>
      </div>
    )
  }
}

RightChatItem.propTypes = {
  'index': PropTypes.number.isRequired,
  'message': PropTypes.object.isRequired,
  'showDate': PropTypes.func.isRequired,
  'displayDate': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'previousMessage': PropTypes.object,
  'user': PropTypes.object.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default RightChatItem
