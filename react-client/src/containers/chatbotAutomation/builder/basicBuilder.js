import React from 'react'
import PropTypes from 'prop-types'

import SIDEBAR from '../../../components/chatbotAutomationNew/sidebar'
import MESSAGEAREA from '../../../components/chatbotAutomationNew/messageArea'

class BasicBuilder extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }


  render () {
    return (
      <div id='_chatbot_configure_area' style={{margin: '15px'}} className='row'>
        <SIDEBAR
          data={this.props.sidebarItems}
          currentBlock={this.props.currentBlock}
          blocks={this.props.blocks}
          updateParentState={this.props.updateParentState}
          chatbot={this.props.chatbot}
          alertMsg={this.props.alertMsg}
          unsavedChanges={this.props.unsavedChanges}
          attachmentUploading={this.props.attachmentUploading}
          handleMessageBlock={this.props.handleMessageBlock}
        />
        <MESSAGEAREA
          user={this.props.user}
          block={this.props.currentBlock}
          chatbot={this.props.chatbot}
          alertMsg={this.props.alertMsg}
          uploadAttachment={this.props.uploadAttachment}
          handleAttachment={this.props.handleAttachment}
          blocks={this.props.blocks}
          handleMessageBlock={this.props.handleMessageBlock}
          changeActiveStatus={this.props.updateChatbot}
          deleteMessageBlock={this.props.deleteMessageBlock}
          progress={this.props.progress}
          updateParentState={this.props.updateParentState}
          sidebarItems={this.props.sidebarItems}
          checkWhitelistedDomains={this.props.checkWhitelistedDomains}
          toggleWhitelistModal={this.props.toggleWhitelistModal}
          allTriggers={this.props.allTriggers}
          attachmentUploading={this.props.attachmentUploading}
        />
      </div>
    )
  }
}

BasicBuilder.propTypes = {
  'blocks': PropTypes.array.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'sidebarItems': PropTypes.array.isRequired,
  'currentBlock': PropTypes.object.isRequired,
  'progress': PropTypes.number.isRequired,
  'unsavedChanges': PropTypes.bool.isRequired,
  'attachmentUploading': PropTypes.bool.isRequired,
  'allTriggers': PropTypes.array.isRequired,
  'updateParentState': PropTypes.func.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired,
  'updateChatbot': PropTypes.func.isRequired,
  'deleteMessageBlock': PropTypes.func,
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired
}

export default BasicBuilder
