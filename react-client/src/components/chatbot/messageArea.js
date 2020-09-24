import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import FOOTER from './footer'
import TEXTAREA from './textArea'
import MENUAREA from './menuArea'
import ATTACHMENTAREA from './attachmentArea'
import TRIGGERAREA from './triggerArea'

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      triggers: [],
      text: '',
      attachment: {},
      options: []
    }
    this.onNext = this.onNext.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.updateState = this.updateState.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.setStateData = this.setStateData.bind(this)
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
              fileData: attachmentComponent
            }
            break
          case 'card':
            attachment = {
              type: 'card',
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
        options: block.options || [],
        triggers: block.triggers || []
      })
    } else {
      this.setState({
        text: '',
        attachment: {},
        triggers: block.triggers || [],
        options: []
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
          fileurl: state.attachment.fileurl
        })
      } else if (state.attachment.type === 'card') {
        payload.push({
          ...state.attachment.cardData,
          componentType: 'card'
        })
      } else if (['audio', 'file'].includes(state.attachment.type)) {
        payload.push({
          ...state.attachment.fileData,
          componentType: state.attachment.type,
          fileurl: state.attachment.fileurl
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
        triggers: this.state.triggers,
        uniqueId: `${this.props.block.uniqueId}`,
        title: this.props.block.title,
        chatbotId: this.props.chatbot.chatbotId,
        payload: this.preparePayload(this.state),
        options: this.state.options
      }
      console.log('data to save for message block', data)
      this.props.handleMessageBlock(data, (res) => this.afterNext(res, data, callback))
    }
  }

  afterNext (res, data, callback) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Saved successfully!')
      const completed = this.props.blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / this.props.blocks.length) * 100)
      this.props.updateParentState({progress, unsavedChanges: false})
    } else {
      this.props.alertMsg.error(res.description)
    }
    callback()
  }

  onDelete () {
    let blockUniqueIds = this.props.sidebarItems.filter((item) => item.parentId && item.parentId === this.props.block.uniqueId).map((item) => item.id)
    blockUniqueIds = [...blockUniqueIds, this.props.block.uniqueId]
    const blockIds = this.props.blocks.filter((item) => item._id && blockUniqueIds.includes(item.uniqueId)).map((item) => item._id)
    console.log('blockIds', blockIds)
    if (blockIds.includes('welcome-id') || blockIds.length === 0) {
      this.afterDelete({status: 'success'}, blockUniqueIds)
    } else {
      this.props.deleteMessageBlock(blockIds, (res) => this.afterDelete(res, blockUniqueIds))
    }
  }

  afterDelete (res, blockUniqueIds) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Message block deleted successfully')
      let blocks = this.props.blocks.filter((item) => !blockUniqueIds.includes(item.uniqueId))
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
        const parentId = this.props.sidebarItems.find((item) =>  item.id === this.props.block.uniqueId).parentId
        const parent = this.props.blocks.find((item) => item.uniqueId === parentId)
        const options = parent.options
        const qrIndex = options.findIndex((item) => item.title === this.props.block.title)
        options.splice(qrIndex, 1)
        parent.options = options
        const bIndex = this.props.blocks.findIndex((item) => item._id === parent._id)
        blocks[bIndex] = parent
        currentBlock = parent
        this.props.handleMessageBlock({...parent, chatbotId: this.props.chatbot._id}, (res) => {
          const completed = blocks.filter((item) => item.payload.length > 0).length
          const progress = Math.floor((completed / blocks.length) * 100)
          this.props.updateParentState({blocks, sidebarItems, currentBlock, progress, unsavedChanges: false})
        })
      }
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
    const blockIndex = blocks.findIndex((item) => item.uniqueId === block.uniqueId)
    const sidebarIndex = sidebarItems.findIndex((item) => item.id === block.uniqueId)
    blocks[blockIndex].title = title
    sidebarItems[sidebarIndex].title = title
    this.props.updateParentState({currentBlock: block, blocks, sidebarItems, unsavedChanges: true})
  }

  onAddChild (title) {
    const childTitles = this.state.options.map((item) => item.title.toLowerCase())
    if (childTitles.includes(title.toLowerCase())) {
      this.props.alertMsg.error('You can not create two children with same name.')
    } else if (['back', 'home'].includes(title.toLowerCase())) {
      this.props.alertMsg.error(`Child name ${title} is not allowed. Please enter a different name.`)
    } else {
      const currentBlock = this.props.block
      const options = this.state.options
      const id = `${new Date().getTime()}`
      const newBlock = {title, payload: [], uniqueId: `${id}`, triggers: [], options: []}
      const sidebarItems = this.props.sidebarItems
      const index = sidebarItems.findIndex((item) => item.id === currentBlock.uniqueId)
      sidebarItems[index].isParent = true
      const newSidebarItem = {title, isParent: false, id, parentId: currentBlock.uniqueId}
      const blocks = [...this.props.blocks, newBlock]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      const option = { title, blockId: id }
      options.push(option)
      currentBlock.options = options
      this.props.updateParentState({
        blocks,
        currentBlock,
        progress,
        sidebarItems: [...sidebarItems, newSidebarItem],
        unsavedChanges: true
      })
      this.setState({options}, () => {
        this.onNext(() => {})
      })
    }
  }

  linkBlock (title) {
    if (['Back', 'Home'].includes(title)) {
      let uniqueId = ''
      if (title === 'Back') {
        const parentId = this.props.sidebarItems.find((item) => item.id === this.props.block.uniqueId).parentId
        uniqueId = this.props.blocks.find((item) => item.uniqueId === parentId).uniqueId
      } else {
        uniqueId = this.props.blocks.find((item) => item.uniqueId === this.props.chatbot.startingBlockId).uniqueId
      }
      let options = this.state.options
      options.push({
        title,
        blockId: uniqueId
      })

      const currentBlock = this.props.block
      currentBlock.options = options

      this.setState({options}, () => {
        this.props.updateParentState({currentBlock, unsavedChanges: true})
      })
    }
  }

  removeLink (title) {
    if (['Back', 'Home'].includes(title)) {
      let options = this.state.options
      const index = options.findIndex((item) => item.title === title)
      options.splice(index, 1)

      const currentBlock = this.props.block
      currentBlock.options = options

      this.setState({options}, () => {
        this.props.updateParentState({currentBlock, unsavedChanges: true})
      })
    }
  }

  canDeleteBlock () {
    if (this.props.chatbot.startingBlockId === this.props.block.uniqueId && this.props.block.payload.length === 0) {
      return false
    } else {
      return true
    }
  }

  showBackHomeButtons () {
    const parentId = this.props.sidebarItems.find((item) => item.id === this.props.block.uniqueId).parentId
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
        <div style={{margin: '0px', height: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet-mobile'>
          <HEADER
            title={this.props.block.title}
            onDelete={this.onDelete}
            alertMsg={this.props.alertMsg}
            onRename={this.renameBlock}
            blocks={this.props.blocks}
            sidebarItems={this.props.sidebarItems}
            block={this.props.block}
            onAddChild={this.onAddChild}
            canAddChild={!(!this.state.text && Object.keys(this.state.attachment).length === 0) && this.state.options.length < 13}
            canDelete={this.canDeleteBlock()}
          />
          <div id='_chatbot_message_area' style={{height: '70vh', padding: '15px', overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
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
            {
              this.state.options.length > 0 &&
              <MENUAREA
                options={this.state.options}
              />
            }
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
          </div>
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
  'allTriggers': PropTypes.array.isRequired,
  'attachmentUploading': PropTypes.bool.isRequired
}

export default MessageArea