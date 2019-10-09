import React from 'react'
import PropTypes from 'prop-types'


class Search extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
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
