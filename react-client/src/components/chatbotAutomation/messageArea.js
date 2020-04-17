import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import FOOTER from './footer'
import TEXTAREA from './textArea'
import ATTACHMENTAREA from './attachmentArea'
import MOREOPTIONS from './moreOptions'
import MODAL from '../extras/modal'
import TRIGGERAREA from './triggerArea'

const MessengerPlugin = require('react-messenger-plugin').default

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      triggers: '',
      text: '',
      attachment: {},
      quickReplies: [],
      canTest: false
    }
    this.onNext = this.onNext.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.updateState = this.updateState.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.setStateData = this.setStateData.bind(this)
    this.showTestModal = this.showTestModal.bind(this)
    this.getTestModalContent = this.getTestModalContent.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
  }

  componentDidMount () {
    if (this.props.block) {
      this.setStateData(this.props.block)
    }
  }

  setStateData (block) {
    if (block.payload.length > 0) {
      const textComponent = block.payload.find((item) => item.componentType === 'text')
      const attachmentComponent = block.payload.find((item) => item.componentType !== 'text')
      let attachment = {}
      if (attachmentComponent) {
        switch (attachmentComponent.componentType) {
          case 'media':
            attachment = {
              type: attachmentComponent.mediaType,
              fileurl: attachmentComponent.fileurl,
              buttons: attachmentComponent.buttons,
              fileData: attachmentComponent
            }
            break
          case 'card':
            attachment = {
              type: 'card',
              buttons: attachmentComponent.buttons,
              cardData: attachmentComponent
            }
            break
          default:
            attachment = {
              type: attachmentComponent.componentType,
              fileurl: attachmentComponent.fileurl,
              fileData: attachmentComponent
            }
        }
      }
      this.setState({
        text: textComponent.text,
        attachment,
        canTest: true,
        triggers: this.props.chatbot.startingBlockId === block._id ? this.props.chatbot.triggers : ''
      })
    } else {
      this.setState({text: '', attachment: {}, canTest: false, triggers: ''})
    }
  }

  updateState (state) {
    this.setState(state)
  }

  preparePayload () {
    let payload = []
    if (this.state.text) {
      payload.push({
        componentType: 'text',
        text: this.state.text
      })
    }
    if (Object.keys(this.state.attachment).length > 0) {
      if (['image', 'video'].includes(this.state.attachment.type)) {
        payload.push({
          componentType: 'media',
          mediaType: this.state.attachment.type,
          fileurl: this.state.attachment.fileurl,
          buttons: this.state.attachment.buttons,
          ...this.state.attachment.fileData
        })
      } else if (this.state.attachment.type === 'card') {
        payload.push({
          componentType: 'card',
          buttons: this.state.attachment.buttons,
          ...this.state.attachment.cardData
        })
      } else if (['audio', 'file'].includes(this.state.attachment.type)) {
        payload.push({
          componentType: this.state.attachment.type,
          fileurl: this.state.attachment.fileurl,
          ...this.state.attachment.fileData
        })
      }
    }
    return payload
  }

  onNext (callback) {
    if (!this.state.text && Object.keys(this.state.attachment).length === 0) {
      this.props.alertMsg.error('Text or attachment is required')
      callback()
    } else {
      const data = {
        triggers: this.state.triggers ? this.state.triggers : undefined,
        uniqueId: `${this.props.block.uniqueId}`,
        title: this.props.block.title,
        chatbotId: this.props.chatbot._id,
        payload: this.preparePayload()
      }
      console.log('data to save for message block', data)
      this.props.handleMessageBlock(data, (res) => this.afterNext(res, callback))
    }
  }

  afterNext (res, callback) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Saved successfully!')
    } else {
      this.props.alertMsg.error(res.description)
    }
    callback()
  }

  showTestModal () {
    this.refs._open_test_chatbot_modal.click()
  }

  getTestModalContent () {
    return (
      <MessengerPlugin
        appId={this.props.fbAppId}
        pageId={this.props.chatbot.pageId}
        size='large'
        passthroughParams='_chatbot'
      />
    )
  }

  onPublish (callback) {
    const data = {
      chatbotId: this.props.chatbot._id,
      published: true
    }
    this.props.changeActiveStatus(data, callback)
  }

  onDisable (callback) {
    const data = {
      chatbotId: this.props.chatbot._id,
      published: false
    }
    this.props.changeActiveStatus(data, callback)
  }

  onDelete () {
    this.props.deleteMessageBlock(this.props.block._id, this.afterDelete)
  }

  afterDelete (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Message block deleted successfully')
    } else {
      this.props.alertMsg.error('Failed to delete message block')
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.block) {
      this.setStateData(nextProps.block)
    }
  }

  render () {
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-9'>
        <div style={{margin: '0px'}} className='m-portlet m-portlet-mobile'>
          <div style={{height: '80vh', position: 'relative', padding: '15px'}} className='m-portlet__body'>
            <HEADER
              title={this.props.block.title}
              showDelete={this.props.block._id && (this.props.chatbot.startingBlockId !== this.props.block._id)}
              onDelete={this.onDelete}
              onTest={this.showTestModal}
              canTest={this.state.canTest}
              canPublish={this.state.canTest}
              onPublish={this.onPublish}
              onDisable={this.onDisable}
              isPublished={this.props.chatbot.published}
              alertMsg={this.props.alertMsg}
            />
            <div className='m--space-30' />
            {
              this.props.chatbot.startingBlockId === this.props.block._id &&
              <TRIGGERAREA
                triggers={this.state.triggers}
                updateParentState={this.updateState}
              />
            }
            {
              this.props.chatbot.startingBlockId === this.props.block._id &&
              <div className='m--space-10' />
            }
            <TEXTAREA
              text={this.state.text}
              updateParentState={this.updateState}
            />
            <div className='m--space-10' />
            <ATTACHMENTAREA
              attachment={this.state.attachment}
              alertMsg={this.props.alertMsg}
              chatbot={this.props.chatbot}
              uploadAttachment={this.props.uploadAttachment}
              handleAttachment={this.props.handleAttachment}
              updateParentState={this.updateState}
            />
            <div className='m--space-10' />
            <MOREOPTIONS
              data={{}}
              chatbot={this.props.chatbot}
              alertMsg={this.props.alertMsg}
              currentLevel={this.props.currentLevel}
              maxLevel={this.props.maxLevel}
              blocks={this.props.blocks}
            />
            <div className='m--space-10' />
            <FOOTER
              showPrevious={false}
              showNext={true}
              onNext={this.onNext}
              onPrevious={() => {}}
            />
            <button ref='_open_test_chatbot_modal' style={{display: 'none'}} data-toggle='modal' data-target='#_test_chatbot' />
            <MODAL
              id='_test_chatbot'
              title='Test Chatbot'
              content={this.getTestModalContent()}
            />
          </div>
        </div>
      </div>
    )
  }
}

MessageArea.propTypes = {
  'block': PropTypes.object.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired,
  'currentLevel': PropTypes.number.isRequired,
  'maxLevel': PropTypes.number.isRequired,
  'blocks': PropTypes.array.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'fbAppId': PropTypes.string.isRequired,
  'changeActiveStatus': PropTypes.func.isRequired,
  'deleteMessageBlock': PropTypes.func.isRequired
}

export default MessageArea
