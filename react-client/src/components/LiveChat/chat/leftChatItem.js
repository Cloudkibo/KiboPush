import React from 'react'
import PropTypes from 'prop-types'

// components
import TEXT from '../messages/text'
import IMAGE from '../messages/image'
import AUDIO from '../messages/audio'
import VIDEO from '../messages/video'
import FILE from '../messages/file'
import CARD from '../messages/card'
import LOCATION from '../messages/location'
import CONTACT from '../messages/contact'

class LeftChatItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getMessage = this.getMessage.bind(this)
    this.getType = this.getType.bind(this)
  }

  getType () {
    let type = this.props.message.payload.type || this.props.message.payload.componentType
    if (
      this.props.message.payload.attachments &&
      this.props.message.payload.attachments.length > 0
    ) {
      type = this.props.message.payload.attachments[0].type
    }
    return type
  }

  getMessage () {
    const type = this.getType()
    const message = this.props.message.payload
    if (type === 'url-card') {
      return (
        <CARD
          type={type}
          card={message}
        />
      )
    } else if (type === 'video') {
      const video = {
        fileurl: { url: message.attachments ? message.attachments[0].payload.url : message.fileurl.url }
      }
      return (
        <div>
          <VIDEO
            video={video}
          />
          {
            message.caption &&
            <div style={{marginTop: '10px'}}>
              <TEXT
                text={{text: message.caption}}
              />
            </div>
          }
        </div>
      )
    } else if (type === 'audio') {
      const audio = {
        fileurl: { url: message.attachments ? message.attachments[0].payload.url : message.fileurl.url  }
      }
      return (
        <AUDIO
          audio={audio}
        />
      )
    } else if (type === 'image') {
      const image = {
        fileurl: message.attachments ? message.attachments[0].payload.url : message.fileurl.url,
      }
      return (
        <div>
          <IMAGE
            image={image}
          />
          {
            message.caption &&
            <div style={{marginTop: '10px'}}>
              <TEXT
                text={{text: message.caption}}
              />
            </div>
          }
        </div>
      )
    } else if (type === 'file') {
      const url = message.attachments ? message.attachments[0].payload.url : message.fileurl.url
      const name = message.fileName || url.split('?')[0].split('/').pop()
      return (
        <FILE
          file={{fileurl: {url}, fileName: name}}
        />
      )
    } else if (type === 'location') {
      return (
        <LOCATION
          data={(message.attachments && message.attachments[0]) || message}
        />
      )
    } else if (type === 'contact') {
      return (
        <CONTACT
          name={message.name}
          number={message.number}
        />
      )
    } else if (message.text) {
      return (
        <TEXT
          text={message}
          urlMeta={this.props.message.url_meta}
        />
      )
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
        <div id={this.props.message._id} className='m-messenger__message m-messenger__message--in'>
          <div className='m-messenger__message-pic'>
            <img src={this.props.activeSession.profilePic} alt='' />
          </div>
          <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div style={{maxWidth: '250px'}} className='m-messenger__message-content'>
              {this.props.showSubscriberNameOnMessage && <div className='m-messenger__message-username'>
                {`${this.props.activeSession.firstName} sent:`}
              </div>}
              {this.getMessage()}
            </div>
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
  'activeSession': PropTypes.object.isRequired,
  'previousMessage': PropTypes.object,
  'showSubscriberNameOnMessage': PropTypes.bool.isRequired
}

export default LeftChatItem
