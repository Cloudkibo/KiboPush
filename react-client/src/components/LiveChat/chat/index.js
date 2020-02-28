import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

// components
import HEADER from './header'
import BODY from './body'
import FOOTER from './footer'
import CONFIRMATIONMODAL from '../../extras/confirmationModal'

class Chat extends React.Component {
  render() {
    return (
      <div style={{padding: '0px', border: '1px solid #F2F3F8', overflow: 'hidden', marginBottom: '0px'}} className='col-xl-5 m-portlet'>

        <ReactTooltip
          place='bottom'
          type='dark'
          effect='solid'
        />

        <CONFIRMATIONMODAL
          id='_resolve-chat-session'
          title='Resolve Chat Session'
          description='Are you sure you want to resolve this chat session?'
          onConfirm={() => {this.props.changeStatus('resolved', this.props.activeSession)}}
        />

        <CONFIRMATIONMODAL
          id='_remove-pending-response'
          title='Remove Pending Response'
          description='Are you sure you want to mark this session as pending?'
          onConfirm={() => {this.props.handlePendingResponse(this.props.activeSession, false)}}
        />

        <HEADER
          activeSession={this.props.activeSession}
          showSearch={this.props.showSearch}
          changeStatus={this.props.changeStatus}
          handlePendingResponse={this.props.handlePendingResponse}
        />
        <BODY />
        <FOOTER
          performAction={this.props.performAction}
          activeSession={this.props.activeSession}
          user={this.props.user}
          sendChatMessage={this.props.sendChatMessage}
          alertMsg={this.props.alertMsg}
          updateState={this.props.updateState}
          userChat={this.props.userChat}
          uploadAttachment={this.props.uploadAttachment}
          sendAttachment={this.props.sendAttachment}
        />
      </div>
    )
  }
}

Chat.propTypes = {
  'userChat': PropTypes.array.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'getChatPreview': PropTypes.func.isRequired,
  'handlePendingResponse': PropTypes.func.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'performAction': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired
}

export default Chat
