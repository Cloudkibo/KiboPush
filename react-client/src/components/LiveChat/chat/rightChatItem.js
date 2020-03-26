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
import CARD from '../messages/card'
import GALLERY from '../messages/gallery'

class RightChatItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      repliedBy: this.props.message.replied_by || this.props.message.repliedBy
    }
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.getMessage = this.getMessage.bind(this)
  }

  getRepliedByMsg () {
    console.log('this.state.repliedBy', this.state.repliedBy)
    let message = ''
    if (
      !this.state.repliedBy ||
      this.state.repliedBy.id === this.props.user._id
    ) {
      message = 'You replied:'
    } else {
      message = `${this.state.repliedBy.name} replied:`
    }
    return message
  }

  getMessage () {
    const message = this.props.message.payload
    const type = message.componentType
    if (['text', 'template'].includes(type)) {
      return (
        <TEXT
          text={message}
          color='white'
          urlMeta={this.props.message.url_meta}
        />
      )
    } else if (['image', 'sticker', 'gif', 'thumbsUp'].includes(type)) {
      return (
        <IMAGE
          image={message}
        />
      )
    } else if (type === 'audio') {
      return (
        <AUDIO
          audio={message}
        />
      )
    } else if (type === 'video') {
      return (
        <VIDEO
          video={message}
        />
      )
    } else if (type === 'file') {
      return (
        <FILE
          file={message}
        />
      )
    } else if (type === 'poll') {
      return (
        <POLL
          poll={message}
        />
      )
    } else if (type === 'survey') {
      return (
        <SURVEY
          survey={message}
        />
      )
    } else if (type === 'list') {
      return (
        <LIST
          list={message}
        />
      )
    } else if (type === 'card') {
      return (
        <CARD
          card={message}
        />
      )
    } else if (type === 'gallery') {
      return (
        <GALLERY
          gallery={message}
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
        <div id={this.props.message._id} className='m-messenger__message m-messenger__message--out'>
          <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div style={{maxWidth: '250px'}} className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                {this.getRepliedByMsg()}
              </div>
              {this.getMessage()}
            </div>
            {this.props.seenElement}
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
