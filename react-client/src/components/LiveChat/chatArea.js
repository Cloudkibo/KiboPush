import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './chatAreaHead'
import BODY from './chatAreaBody'

class ChatArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.setMessageData = this.setMessageData.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
  }
  
  setMessageData (session, payload) {
    var data = ''
    data = {
      sender_id: session.pageId._id, // this is the page id: _id of Pageid
      recipient_id: session._id, // this is the subscriber id: _id of subscriberId
      sender_fb_id: session.pageId.pageId, // this is the (facebook) :page id of pageId
      recipient_fb_id: session.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
      session_id: session._id,
      company_id: session.companyId, // this is admin id till we have companies
      payload: payload, // this where message content will go
      url_meta: this.state.urlmeta,
      datetime: new Date().toString(),
      status: 'unseen', // seen or unseen
      replied_by: {
        type: 'agent',
        id: this.props.user._id,
        name: this.props.user.name
      }
    }
    return data
  }
  setDataPayload (component, state) {
    var payload = ''
    if (component === 'attachment') {
      payload = {
        componentType: state.componentType,
        fileName: state.attachment.name,
        size: state.attachment.size,
        type: state.attachmentType,
        fileurl: {
          id: state.uploadedId,
          name: state.attachment.name,
          url: state.uploadedUrl
        }
      }
    } else if (component === 'gif') {
      payload = {
        componentType: state.componentType,
        fileurl: state.gifUrl
      }
    } else if (component === 'sticker') {
      payload = {
        componentType: state.componentType,
        fileurl: state.stickerUrl
      }
    } else if (component === 'text') {
      payload = {
        componentType: 'text',
        text: state.textAreaValue
      }
    } else if (component === 'thumbsUp') {
      payload = {
        componentType: 'thumbsUp',
        fileurl: 'http://cdn.cloudkibo.com/public/img/thumbsup.png'
      }
    }
    return payload
  }

  render () {
    return (
      <div className='col-xl-5'>
        <div className='m-portlet m-portlet--mobile'>
          <HEADER
            activeSession={this.props.activeSession}
            showSearch={this.props.showSearch}
            changeStatus={this.props.changeStatus}
          />
          <BODY
            chatCount={this.props.chatCount}
            userChat={this.props.userChat}
            fetchUrlMeta={this.props.fetchUrlMeta}
            activeSession={this.props.activeSession}
            setMessageData={this.setMessageData}
            setDataPayload={this.setDataPayload}
            sendAttachment={this.props.sendAttachment}
            sendChatMessage={this.props.sendChatMessage}
            deletefile={this.props.deletefile}
            uploadAttachment={this.uploadAttachment}
            loadingUrl={this.props.loadingUrl}
            urlValue={this.props.urlValue}
            user={this.props.user}
            updatePendingSession={this.props.updatePendingSession}
          />
        </div>
      </div>
    )
  }
}

ChatArea.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'chatCount': PropTypes.number.isRequired,
  'userChat': PropTypes.array.isRequired,
  'fetchUrlMeta': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'deletefile': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'loadingUrl': PropTypes.bool.isRequired,
  'urlValue': PropTypes.string.isRequired,
  'user': PropTypes.object.isRequired
}

export default ChatArea
