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
      quickReplies: []
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
    this.canDeleteBlock = this.canDeleteBlock.bind(this)
    this.showBackHomeButtons = this.showBackHomeButtons.bind(this)
    this.linkBlock = this.linkBlock.bind(this)
    this.removeLink = this.removeLink.bind(this)
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
      let parentState = {
        currentBlock,
        chatbot,
        unsavedChanges: true
      }
      if (allTriggers) {
        parentState.allTriggers = allTriggers
      }
      if (state.attachmentUploading !== undefined) {
        parentState.attachmentUploading = state.attachmentUploading
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
      let chatbot = this.props.chatbot
      this.props.alertMsg.success('Saved successfully!')
      let blocks = this.props.blocks
      const index = blocks.findIndex((item) => item.uniqueId.toString() === data.uniqueId.toString())
      if (index !== -1) {
        const deletedItem = blocks.splice(index, 1)
        if (res.payload.upserted && res.payload.upserted.length > 0) {
       if(chatbot.startingBlockId === 'welcome-id') {
          chatbot.startingBlockId = res.payload.upserted[0]._id
       }
          data._id = res.payload.upserted[0]._id
        } else {
          data._id = deletedItem[0]._id
        }
      }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      this.props.updateParentState({blocks, chatbot, progress, unsavedChanges: false})
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
    let blockUniqueIds = [this.props.block.uniqueId.toString()]
    let childBlocks = this.props.sidebarItems.filter((item) => blockUniqueIds.indexOf(item.id.toString()) === -1)
    /* eslint-disable */
    do {
      let ids = childBlocks
        .filter((item) => blockUniqueIds.includes(item.parentId))
        .map((item) => item.id)
      blockUniqueIds = [...blockUniqueIds, ...ids]
      childBlocks = this.props.sidebarItems.filter((item) => blockUniqueIds.indexOf(item.id) === -1)
    } while (childBlocks.filter((item) => blockUniqueIds.includes(item.parentId)).length > 0)
    /* eslint-enable */
    const blockIds = this.props.blocks.filter((item) => item._id && blockUniqueIds.includes(item.uniqueId)).map((item) => item._id)
    if (blockIds.includes('welcome-id') || blockIds.length === 0) {
      this.afterDelete({status: 'success'}, blockUniqueIds)
    } else {
      this.props.deleteMessageBlock(blockIds, (res) => this.afterDelete(res, blockUniqueIds))
    }
  }

  afterDelete (res, blockUniqueIds) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Message block deleted successfully')
      let blocks = this.props.blocks.filter((item) => !blockUniqueIds.includes(item.uniqueId.toString()))
      let sidebarItems = this.props.sidebarItems.filter((item) => !blockUniqueIds.includes(item.id))
      let currentBlock = {}
      if (blocks.length === 0) {
        const id = new Date().getTime()
        blocks = [{
          _id: 'welcome-id',
          title: 'Welcome',
          payload: [],
          uniqueId: id,
          triggers: []
        }]
        sidebarItems = [{
          title: 'Welcome',
          id,
          isParent: false
        }]
        currentBlock = blocks[0]
        this.props.updateParentState({blocks, sidebarItems, currentBlock})
      } else {
        const parentId = this.props.sidebarItems.find((item) =>  item.id.toString() === this.props.block.uniqueId.toString()).parentId
        if (parentId) {
          const parent = this.props.blocks.find((item) => item.uniqueId.toString() === parentId.toString())
          const quickReplies = parent.payload[parent.payload.length - 1].quickReplies
          const qrIndex = quickReplies.findIndex((item) => item.title === this.props.block.title)
          quickReplies.splice(qrIndex, 1)
          parent.quickReplies = quickReplies
          const bIndex = this.props.blocks.findIndex((item) => item._id === parent._id)
          blocks[bIndex] = parent
          currentBlock = parent
          this.props.handleMessageBlock({...parent, chatbotId: this.props.chatbot._id}, (res) => {
            const completed = blocks.filter((item) => item.payload.length > 0).length
            const progress = Math.floor((completed / blocks.length) * 100)
            this.props.updateParentState({blocks, sidebarItems, currentBlock, progress, unsavedChanges: false})
          })
        }
      }
    } else {
      this.props.alertMsg.error(res.description || 'Failed to delete message block')
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
    console.log('add child', this.props)
    const childTitles = this.state.quickReplies.map((item) => item.title)
    if (childTitles.includes(title)) {
      this.props.alertMsg.error('You can not create two children with same name.')
    } else if (['Back', 'Home'].includes(title)) {
      this.props.alertMsg.error(`Child name ${title} is not allowed. Please enter a different name.`)
    } else {
      // let chatbot = this.props.chatbot
      // if(chatbot.startingBlockId === 'welcome-id') {
      //   chatbot.startingBlockId
      // }
      console.log('this.props.blocks before', this.props.blocks)
      const currentBlock = this.props.block
      const options = this.state.quickReplies
      const id = new Date().getTime()
      const newBlock = {title, payload: [], uniqueId: `${id}`, triggers: []}
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
        payload: JSON.stringify([{action: '_chatbot', blockUniqueId: `${id}`, payloadAction: 'create', parentBlockTitle: this.props.block.title}])
      }
      options.push(option)
      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = options
      } else {
        currentBlock.payload.push({quickReplies: options})
      }
      console.log('this.props.blocks after', blocks)
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

  linkBlock (title) {
    if (['Back', 'Home', 'talk_to_agent'].includes(title)) {
      let uniqueId = ''
      if (title === 'Back') {
        const parentId = this.props.sidebarItems.find((item) => item.id.toString() === this.props.block.uniqueId.toString()).parentId
        if(parentId) {
         uniqueId = this.props.blocks.find((item) => item.uniqueId.toString() === parentId.toString()).uniqueId
        }
      } else if (title !== 'talk_to_agent') {
        uniqueId = this.props.blocks.find((item) => item._id === this.props.chatbot.startingBlockId).uniqueId
      }
      let quickReplies = this.state.quickReplies
      if (title === 'talk_to_agent') {
        quickReplies.push({
          content_type: 'text',
          title: 'Talk to agent',
          payload: JSON.stringify([{
            action: '_chatbot',
            payloadAction: 'talk_to_agent',
            chatbotId: this.props.chatbot._id,
            parentBlockTitle: this.props.block.title
          }])
        })
      } else {
        quickReplies.push({
          content_type: 'text',
          title,
          payload: JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId, parentBlockTitle: this.props.block.title}])
        })
      }

      const currentBlock = this.props.block

      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = quickReplies
      } else {
        currentBlock.payload.push({quickReplies})
      }

      this.setState({quickReplies}, () => {
        this.props.updateParentState({currentBlock, unsavedChanges: true})
      })
    }
  }

  removeLink (title) {
    let quickReplies = this.state.quickReplies
    let index = -1
    if (['Back', 'Home'].includes(title)) {
      index = quickReplies.findIndex((item) => item.title === title)
    } else if (title === 'talk_to_agent') {
      index = quickReplies.findIndex((item) => JSON.parse(item.payload) && JSON.parse(item.payload)[0].payloadAction === 'talk_to_agent')
    }

    if (index > -1) {
      quickReplies.splice(index, 1)
      const currentBlock = this.props.block
      if (currentBlock.payload.length > 0) {
        currentBlock.payload[currentBlock.payload.length - 1].quickReplies = quickReplies
      } else {
        currentBlock.payload.push({quickReplies})
      }

      this.setState({quickReplies}, () => {
        this.props.updateParentState({currentBlock, unsavedChanges: true})
      })
    }
  }

  canDeleteBlock () {
    if (this.props.block._id === 'welcome-id' && this.props.block.payload.length === 0) {
      return false
    } else {
      return true
    }
  }

  showBackHomeButtons () {
    const parentId = this.props.sidebarItems.find((item) => item.id.toString() === this.props.block.uniqueId.toString()).parentId
    if (parentId) {
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
          <div id='_chatbot_message_area' style={{height: '70vh', position: 'relative', padding: '15px', overflowY: 'scroll'}} className='m-portlet__body'>
            <HEADER
              title={this.props.block.title}
              onDelete={this.onDelete}
              alertMsg={this.props.alertMsg}
              onRename={this.renameBlock}
              blocks={this.props.blocks}
              sidebarItems={this.props.sidebarItems}
              block={this.props.block}
              onAddChild={this.onAddChild}
              canAddChild={!(!this.state.text && Object.keys(this.state.attachment).length === 0) && this.state.quickReplies.length < 13}
              canDelete={this.canDeleteBlock()}
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
              disableNext={this.props.attachmentUploading}
              showBackHomeButtons={this.showBackHomeButtons()}
              linkBlock={this.linkBlock}
              removeLink={this.removeLink}
              currentBlock={this.props.block}
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
  'blocks': PropTypes.array.isRequired,
  'sidebarItems': PropTypes.array.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'changeActiveStatus': PropTypes.func.isRequired,
  'deleteMessageBlock': PropTypes.func.isRequired,
  'progress': PropTypes.number.isRequired,
  'updateParentState': PropTypes.func.isRequired,
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired,
  'allTriggers': PropTypes.array.isRequired,
  'attachmentUploading': PropTypes.bool.isRequired
}

export default MessageArea
