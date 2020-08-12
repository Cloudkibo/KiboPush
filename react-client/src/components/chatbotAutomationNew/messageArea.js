import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import FOOTER from './footer'
import TEXTAREA from '../chatbotAutomation/textArea'
import ATTACHMENTAREA from '../chatbotAutomation/attachmentArea'
import TRIGGERAREA from '../chatbotAutomation/triggerArea'

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      triggers: [],
      text: '',
      attachment: {},
      quickReplies: [],
      disableNext: false
    }
    this.onNext = this.onNext.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.updateState = this.updateState.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.setStateData = this.setStateData.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.renameBlock = this.renameBlock.bind(this)
    this.onAddChild = this.onAddChild.bind(this)
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
        text: textComponent ? textComponent.text : '',
        attachment,
        quickReplies: block.payload[block.payload.length - 1].quickReplies || [],
        triggers: block.triggers || []
      })
    } else {
      this.setState({
        text: '',
        attachment: {},
        triggers: block.triggers || [],
        quickReplies: []
      })
    }
  }

  updateState (state, allTriggers) {
    this.setState(state, () => {
      const currentBlock = this.props.block
      const payload = this.preparePayload(this.state)
      currentBlock.payload = payload
      currentBlock.triggers = this.state.triggers
      const chatbot = this.props.chatbot
      let parentState = {currentBlock, chatbot, unsavedChanges: true}
      if (allTriggers) {
        parentState.allTriggers = allTriggers
      }
      this.props.updateParentState(parentState)
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
        updateStartingBlockId: (this.props.block._id === 'welcome-id'),
        payload: this.preparePayload(this.state)
      }
      const dataToShow = data
      dataToShow.stats = this.props.block.stats
      console.log('data to save for message block', data)
      this.props.handleMessageBlock(data, (res) => this.afterNext(res, dataToShow, callback))
    }
  }

  afterNext (res, data, callback) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Saved successfully!')
      let blocks = this.props.blocks
      const index = blocks.findIndex((item) => item.uniqueId.toString() === data.uniqueId.toString())
      if (index !== -1) {
        blocks.splice(index, 1)
      }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      this.props.updateParentState({blocks, progress, unsavedChanges: false})
    } else {
      this.props.alertMsg.error(res.description)
    }
    callback()
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
      const { blocks, sidebarItems } = this.props
      const blockIndex = blocks.findIndex((item) => item.uniqueId.toString() === this.props.block.uniqueId.toString())
      const sidebarIndex = sidebarItems.findIndex((item) => item.id.toString() === this.props.block.uniqueId.toString())
      if (blockIndex > -1) {
        blocks.splice(blockIndex, 1)
      }
      if (sidebarIndex > -1) {
        sidebarItems.splice(sidebarIndex, 1)
      }
      this.props.updateParentState({blocks, sidebarItems, currentBlock: blocks[0]})
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

  renameBlock (title) {
    let { block, blocks, sidebarItems } = this.props
    block.title = title
    const blockIndex = blocks.findIndex((item) => item.uniqueId.toString() === block.uniqueId.toString())
    const sidebarIndex = sidebarItems.findIndex((item) => item.id.toString() === block.uniqueId.toString())
    blocks[blockIndex].title = title
    sidebarItems[sidebarIndex].title = title
    this.props.updateParentState({currentBlock: block, blocks, sidebarItems, unsavedChanges: true})
  }

  onAddChild (title) {
    const titles = this.props.blocks.map((item) => item.title.toLowerCase())
    if (titles.indexOf(title.toLowerCase()) > -1) {
      this.props.alertMsg.error('A block with this title already exists. Please choose a diffrent title')
    } else {
      const currentBlock = this.props.block
      const options = this.state.quickReplies
      const id = new Date().getTime()
      const newBlock = {title, payload: [], uniqueId: `${id}`, triggers: [title.toLowerCase()]}
      const sidebarItems = this.props.sidebarItems
      const index = sidebarItems.findIndex((item) => item.id.toString() === currentBlock.uniqueId.toString())
      sidebarItems[index].isParent = true
      const newSidebarItem = {title, isParent: false, id: `${id}`, parentId: currentBlock.uniqueId}
      const blocks = [...this.props.blocks, newBlock]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      const option = {
        content_type: 'text',
        title,
        payload: JSON.stringify([{action: '_chatbot', blockUniqueId: `${id}`, payloadAction: 'create'}])
      }
      options.push(option)
      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = options
      } else {
        currentBlock.payload.push({quickReplies: options})
      }
      this.props.updateParentState({
        blocks,
        currentBlock,
        progress,
        sidebarItems: [...sidebarItems, newSidebarItem],
        unsavedChanges: true
      })
      this.setState({quickReplies: options, triggers: [title.toLowerCase()]}, () => {
        this.onNext(() => {})
      })
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.block) {
      this.setStateData(nextProps.block)
    }
  }

  render () {
    console.log('this.props.block', this.props.block)
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-9'>
        <div style={{margin: '0px'}} className='m-portlet m-portlet-mobile'>
          <div id='_chatbot_message_area' style={{height: '70vh', position: 'relative', padding: '15px', overflowY: 'scroll'}} className='m-portlet__body'>
            <HEADER
              title={this.props.block.title}
              onDelete={this.onDelete}
              alertMsg={this.props.alertMsg}
              onRename={this.renameBlock}
              blocks={this.props.blocks}
              onAddChild={this.onAddChild}
            />
            <div className='m--space-30' />
            <TRIGGERAREA
              triggers={this.state.triggers}
              updateParentState={this.updateState}
              updateGrandParentState={this.props.updateParentState}
              alertMsg={this.props.alertMsg}
              allTriggers={this.props.allTriggers}
            />
            <div className='m--space-10' />
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
              checkWhitelistedDomains={this.props.checkWhitelistedDomains}
              toggleWhitelistModal={this.props.toggleWhitelistModal}
            />
            <div className='m--space-10' />
            <FOOTER
              onNext={this.onNext}
              disableNext={this.state.disableNext}
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
  'updateParentState': PropTypes.func.isRequired,
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired,
  'allTriggers': PropTypes.array.isRequired
}

export default MessageArea
