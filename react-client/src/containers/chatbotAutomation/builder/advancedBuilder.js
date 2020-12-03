import React from 'react'
import PropTypes from 'prop-types'

import SIDEBAR from '../../../components/chatbotAutomation/sidebar'
import MESSAGEAREA from '../../../components/chatbotAutomation/messageArea'

class AdvancedBuilder extends React.Component {
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
          fetchBackup={this.props.fetchBackup}
          createBackup={this.props.createBackup}
          restoreBackup={this.props.restoreBackup}
          alertMsg={this.props.alertMsg}
          fetchChatbotDetails={this.props.fetchChatbotDetails}
          fetchChatbot={this.props.fetchChatbot}
          unsavedChanges={this.props.unsavedChanges}
          handleMessageBlock={this.props.handleMessageBlock}
        />
        <MESSAGEAREA
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
          superUser={this.props.superUser}
          urlMetaData={this.props.urlMetaData}
          messengerComponents={this.props.messengerComponents}
        />
      </div>
    )
  }
}

AdvancedBuilder.propTypes = {
  'blocks': PropTypes.array.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'sidebarItems': PropTypes.array.isRequired,
  'currentBlock': PropTypes.object.isRequired,
  'progress': PropTypes.number.isRequired,
  'unsavedChanges': PropTypes.bool.isRequired,
  'attachmentUploading': PropTypes.bool.isRequired,
  'allTriggers': PropTypes.array.isRequired,
  'updateParentState': PropTypes.func.isRequired,
  'fetchBackup': PropTypes.func.isRequired,
  'createBackup': PropTypes.func.isRequired,
  'restoreBackup': PropTypes.func.isRequired,
  'fetchChatbotDetails': PropTypes.func.isRequired,
  'fetchChatbot': PropTypes.func.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired,
  'updateChatbot': PropTypes.func.isRequired,
  'deleteMessageBlock': PropTypes.func.isRequired,
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired,
  'superUser': PropTypes.object
}

export default AdvancedBuilder
