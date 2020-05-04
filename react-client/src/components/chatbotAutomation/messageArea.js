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
      triggers: undefined,
      text: '',
      attachment: {},
      quickReplies: [],
      showTestContent: false,
      disableNext: false
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
    this.toggleTestModalContent = this.toggleTestModalContent.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.addOption = this.addOption.bind(this)
    this.removeOption = this.removeOption.bind(this)
    this.updateOption = this.updateOption.bind(this)
    this.renameBlock = this.renameBlock.bind(this)
    this.checkEmptyBlock = this.checkEmptyBlock.bind(this)
  }

  componentDidMount () {
    if (this.props.block) {
      this.setStateData(this.props.block)
    }

    let comp = this
    this.props.registerSocketAction({
      event: 'chatbot.test.message',
      action: function (data) {
        comp.props.alertMsg.success('Sent successfully on messenger')
        comp.refs._open_test_chatbot_modal.click()
        comp.toggleTestModalContent()
      }
    })
  }

  toggleTestModalContent () {
    this.setState({showTestContent: !this.state.showTestContent})
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
        text: textComponent ? textComponent.text : '',
        attachment,
        quickReplies: block.payload[block.payload.length - 1].quickReplies || [],
        triggers: this.props.chatbot.startingBlockId === block._id ? this.props.chatbot.triggers : undefined
      })
    } else {
      this.setState({
        text: '',
        attachment: {},
        triggers: this.props.chatbot.startingBlockId === block._id ? this.props.chatbot.triggers : block.triggers,
        quickReplies: []
      })
    }
  }

  updateState (state) {
    this.setState(state, () => {
      const currentBlock = this.props.block
      const payload = this.preparePayload(this.state)
      currentBlock.payload = payload
      const chatbot = this.props.chatbot
      if (this.state.triggers) {
        chatbot.triggers = this.state.triggers
      }
      this.props.updateParentState({currentBlock, chatbot})
    })
  }

  preparePayload (state) {
    let payload = []
    if (state.text) {
      payload.push({
        componentType: 'text',
        text: state.text
      })
    }
    if (Object.keys(state.attachment).length > 0) {
      if (['image', 'video'].includes(state.attachment.type)) {
        payload.push({
          ...state.attachment.fileData,
          componentType: 'media',
          mediaType: state.attachment.type,
          fileurl: state.attachment.fileurl,
          buttons: state.attachment.buttons
        })
      } else if (state.attachment.type === 'card') {
        payload.push({
          ...state.attachment.cardData,
          componentType: 'card',
          buttons: state.attachment.buttons
        })
      } else if (['audio', 'file'].includes(state.attachment.type)) {
        payload.push({
          ...state.attachment.fileData,
          componentType: state.attachment.type,
          fileurl: state.attachment.fileurl
        })
      }
    }
    if (payload.length > 0) {
      payload[payload.length - 1].quickReplies = state.quickReplies
    }
    return payload
  }

  onNext (callback) {
    if (!this.state.text && Object.keys(this.state.attachment).length === 0) {
      this.props.alertMsg.error('Text or attachment is required')
      callback()
    } else {
      const data = {
        triggers: this.state.triggers,
        uniqueId: `${this.props.block.uniqueId}`,
        title: this.props.block.title,
        chatbotId: this.props.chatbot._id,
        payload: this.preparePayload(this.state)
      }
      console.log('data to save for message block', data)
      this.props.handleMessageBlock(data, (res) => this.afterNext(res, data, callback))
    }
  }

  afterNext (res, data, callback) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Saved successfully!')
      let blocks = this.props.blocks
      const index = blocks.findIndex((item) => item.uniqueId.toString() === data.uniqueId.toString())
      if (index !== -1) {
        const deletedItem = blocks.splice(index, 1)
        if (res.payload.upserted && res.payload.upserted.length > 0) {
          data._id = res.payload.upserted[0]._id
        } else {
          data._id = deletedItem[0]._id
        }
      }
      const chatbot = this.props.chatbot
      if (data.triggers && data._id) {
        chatbot.startingBlockId = data._id
      }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      const incompleteBlocks = blocks.filter((item) => item.payload.length === 0)
      let currentBlock = data
      if (incompleteBlocks.length > 0) {
        currentBlock = incompleteBlocks[0]
      }
      this.props.updateParentState({blocks, currentBlock, progress})
    } else {
      this.props.alertMsg.error(res.description)
    }
    callback()
  }

  showTestModal () {
    this.setState({showTestContent: true}, () => {
      this.refs._open_test_chatbot_modal.click()
    })
  }

  getTestModalContent () {
    if (this.state.showTestContent) {
      return (
        <MessengerPlugin
          appId={this.props.fbAppId}
          pageId={this.props.chatbot.pageFbId}
          size='large'
          passthroughParams='_chatbot'
        />
      )
    } else {
      return (<div />)
    }
  }

  onPublish (callback) {
    const data = {
      chatbotId: this.props.chatbot._id,
      published: true
    }
    this.props.changeActiveStatus(data, (res) => this.afterPublish(res, callback))
  }

  onDisable (callback) {
    const data = {
      chatbotId: this.props.chatbot._id,
      published: false
    }
    this.props.changeActiveStatus(data, (res) => this.afterDisable(res, callback))
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

  afterPublish (res, callback) {
    callback(res)
    if (res.status === 'success') {
      let chatbot = this.props.chatbot
      chatbot.published = true
      this.props.updateParentState({chatbot})
    }
  }

  afterDisable (res, callback) {
    callback(res)
    if (res.status === 'success') {
      let chatbot = this.props.chatbot
      chatbot.published = false
      this.props.updateParentState({chatbot})
    }
  }

  addOption (title, action, uniqueId) {
    const options = this.state.quickReplies
    let option = {
      content_type: 'text',
      title
    }
    if (action === 'link') {
      option.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId}])
      options.push(option)
    } else if (action === 'create') {
      const id = new Date().getTime()
      const newBlock = {title, payload: [], uniqueId: id}
      const sidebarItems = this.props.sidebarItems
      const index = sidebarItems.findIndex((item) => item.id.toString() === this.props.block.uniqueId.toString())
      sidebarItems[index].isParent = true
      const newSidebarItem = {title, isParent: false, id, parentId: this.props.block.uniqueId}
      const blocks = [...this.props.blocks, newBlock]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      option.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: id, payloadAction: 'create'}])
      options.push(option)
      const currentBlock = this.props.block
      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = options
      } else {
        currentBlock.payload.push({quickReplies: options})
      }
      this.props.updateParentState({
        blocks,
        currentBlock,
        progress,
        sidebarItems: [...sidebarItems, newSidebarItem]
      })
    }
    this.setState({quickReplies: options})
  }

  updateOption (uniqueId, index, title, action) {
    const quickReplies = this.state.quickReplies
    quickReplies[index].title = title

    if (action === 'create') {
      const {blocks, sidebarItems} = this.props
      const blockIndex = blocks.findIndex((item) => item.uniqueId === uniqueId)
      const sidebarIndex = sidebarItems.findIndex((item) => item.id === uniqueId)
      blocks[blockIndex].title = title
      sidebarItems[sidebarIndex].title = title
      const currentBlock = this.props.block
      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = quickReplies
      } else {
        currentBlock.payload.push({quickReplies})
      }
      this.props.updateParentState({blocks, currentBlock, sidebarItems})
    }

    this.setState({quickReplies})
  }

  removeOption (uniqueId, index, action) {
    const quickReplies = this.state.quickReplies
    quickReplies.splice(index, 1)

    const currentBlock = this.props.block
    if (currentBlock.payload.length > 0) {
      currentBlock.payload[currentBlock.payload.length - 1].quickReplies = quickReplies
    } else {
      currentBlock.payload.push({quickReplies})
    }

    this.props.updateParentState({currentBlock})
    this.setState({quickReplies})
  }

  renameBlock (title) {
    let { block, blocks, sidebarItems } = this.props
    block.title = title
    const blockIndex = blocks.findIndex((item) => item.uniqueId.toString() === block.uniqueId.toString())
    const sidebarIndex = sidebarItems.findIndex((item) => item.id.toString() === block.uniqueId.toString())
    blocks[blockIndex].title = title
    sidebarItems[sidebarIndex].title = title
    this.props.updateParentState({currentBlock: block, blocks, sidebarItems})
  }

  checkEmptyBlock () {
    const { block, blocks } = this.props
    const emptyBlocks = blocks.filter((item) => item.payload.length === 0 && item.uniqueId.toString() !== block.uniqueId.toString())
    if (emptyBlocks.length > 0) {
      return true
    } else {
      return false
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
              showDelete={false}
              onDelete={this.onDelete}
              onTest={this.showTestModal}
              canTest={this.props.progress === 100}
              canPublish={this.props.progress === 100}
              onPublish={this.onPublish}
              onDisable={this.onDisable}
              isPublished={this.props.chatbot.published}
              alertMsg={this.props.alertMsg}
              onRename={this.renameBlock}
            />
            <div className='m--space-30' />
            {
              this.props.chatbot.startingBlockId === this.props.block._id &&
              <TRIGGERAREA
                triggers={this.state.triggers}
                updateParentState={this.updateState}
                alertMsg={this.props.alertMsg}
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
            {
              (this.state.text || Object.keys(this.state.attachment).length > 0) &&
              <MOREOPTIONS
                data={this.state.quickReplies}
                chatbot={this.props.chatbot}
                alertMsg={this.props.alertMsg}
                currentLevel={this.props.currentLevel}
                maxLevel={this.props.maxLevel}
                blocks={this.props.blocks}
                addOption={this.addOption}
                removeOption={this.removeOption}
                updateOption={this.updateOption}
              />
            }
            <div className='m--space-10' />
            <FOOTER
              showPrevious={false}
              showNext={true}
              onNext={this.onNext}
              disableNext={this.state.disableNext}
              onPrevious={() => {}}
              emptyBlocks={this.checkEmptyBlock()}
            />
            <button ref='_open_test_chatbot_modal' style={{display: 'none'}} data-toggle='modal' data-target='#_test_chatbot' />
            <MODAL
              id='_test_chatbot'
              title='Test Chatbot'
              content={this.getTestModalContent()}
              onClose={this.toggleTestModalContent}
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
  'sidebarItems': PropTypes.array.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'fbAppId': PropTypes.string.isRequired,
  'changeActiveStatus': PropTypes.func.isRequired,
  'deleteMessageBlock': PropTypes.func.isRequired,
  'registerSocketAction': PropTypes.func.isRequired,
  'progress': PropTypes.number.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

export default MessageArea
