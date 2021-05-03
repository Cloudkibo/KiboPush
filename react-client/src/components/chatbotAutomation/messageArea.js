import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import FOOTER from './footer'
import TEXTAREA from './textArea'
import ATTACHMENTAREA from './attachmentArea'
import MOREOPTIONS from './moreOptions'
import TRIGGERAREA from './triggerArea'
import MESSAGEBLOCKUSAGE from './messageBlockUsage'
import COMPONENTSELECTION from './componentSelection'
import CAROUSELAREA from './carouselArea'
import CONFIRMATIONMODAL from '../extras/confirmationModal'
import CAROUSELMODAL from './carouselModal'
import LinkCarouselModal from './linkCarouselModal'

class MessageArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      triggers: [],
      text: '',
      attachment: {},
      quickReplies: [],
      showTestContent: false,
      disableNext: false,
      selectedComponent: '',
      carouselCards: null,
      showingSuggestion: false,
      suggestionShown: false
    }
    this.onNext = this.onNext.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.updateState = this.updateState.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.setStateData = this.setStateData.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    this.addOption = this.addOption.bind(this)
    this.removeOption = this.removeOption.bind(this)
    this.updateOption = this.updateOption.bind(this)
    this.renameBlock = this.renameBlock.bind(this)
    this.checkEmptyBlock = this.checkEmptyBlock.bind(this)
    this.isOrphanBlock = this.isOrphanBlock.bind(this)
    this.onSelectComponent = this.onSelectComponent.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.getRemoveModalContent = this.getRemoveModalContent.bind(this)
    this.updateCarouselCards = this.updateCarouselCards.bind(this)
    this.canDeleteBlock = this.canDeleteBlock.bind(this)
    this.linkBlock = this.linkBlock.bind(this)
    this.removeLink = this.removeLink.bind(this)
  }

  componentDidMount () {
    if (this.props.block) {
      this.setStateData(this.props.block)
    }
  }

  showTalkToAgentButton () {
    const parentId = this.props.sidebarItems.find((item) => item.id.toString() === this.props.block.uniqueId.toString()).parentId
    if (parentId) {
      return false
    } else {
      return true
    }
  }

  setStateData (block) {
    if (block.payload.length > 0) {
      const textComponent = block.payload.find((item) => item.componentType === 'text')
      const attachmentComponent = block.payload.find((item) => item.componentType !== 'text')
      const additionalActions = block.payload[block.payload.length - 1].quickReplies ? block.payload[block.payload.length - 1].quickReplies.find((qr) => !!qr.query) : null
      let attachment = {}
      let carouselCards = null
      let selectedComponent = this.props.block.uniqueId === block.uniqueId ? this.state.selectedComponent : ''
      if (attachmentComponent) {
        switch (attachmentComponent.componentType) {
          case 'media':
            selectedComponent = 'attachment'
            attachment = {
              type: attachmentComponent.mediaType,
              fileurl: attachmentComponent.fileurl,
              buttons: attachmentComponent.buttons,
              fileData: attachmentComponent
            }
            break
          case 'card':
            selectedComponent = 'attachment'
            attachment = {
              type: 'card',
              buttons: attachmentComponent.buttons,
              cardData: attachmentComponent
            }
            break
          case 'gallery':
            selectedComponent = attachmentComponent.componentName
            carouselCards = attachmentComponent.cards
            break
          default:
            selectedComponent = 'attachment'
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
        triggers: block.triggers || [],
        carouselCards,
        selectedComponent,
        additionalActions
      })
    } else {
      this.setState({
        text: '',
        attachment: {},
        triggers: block.triggers || [],
        quickReplies: [],
        carouselCards: null,
        selectedComponent: this.props.block.uniqueId === block.uniqueId ? this.state.selectedComponent : ''
      })
    }
  }

  updateState (state, allTriggers, callback) {
    this.setState(state, () => {
      const currentBlock = this.props.block
      const payload = this.preparePayload(this.state)
      currentBlock.payload = payload
      currentBlock.triggers = this.state.triggers
      const chatbot = this.props.chatbot
      // if (this.s2tate.triggers) {
      //   chatbot.triggers = this.state.triggers
      // }
      let parentState = {currentBlock, chatbot, unsavedChanges: true}
      if (allTriggers) {
        parentState.allTriggers = allTriggers
      }
      if (callback) {
        callback()
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
    if (this.state.carouselCards) {
      payload.push({
        cards: this.state.carouselCards,
        componentType: 'gallery',
        componentName: this.state.selectedComponent
      })
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
        // const deletedItem = blocks.splice(index, 1)
        // if (res.payload.upserted && res.payload.upserted.length > 0) {
        //   data._id = res.payload.upserted[0]._id
        // } else {
        //   data._id = deletedItem[0]._id
        // }
      }
      // const chatbot = this.props.chatbot
      // if (data.triggers && data._id) {
      //   chatbot.startingBlockId = data._id
      // }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      const incompleteBlocks = blocks.filter((item) => item.payload.length === 0)
      let currentBlock = data
      if (incompleteBlocks.length > 0) {
        currentBlock = incompleteBlocks[0]
      }
      this.props.updateParentState({blocks, currentBlock, progress, unsavedChanges: false})
    } else {
      this.props.alertMsg.error(res.description)
    }
    callback()
  }

  deleteButtonOnCards(blockId) {
    let blocks = JSON.parse(JSON.stringify(this.props.blocks))
    blocks.forEach(function(block) {
      block.payload.forEach(function(payload) {
        if(payload.componentType === 'gallery') {
          let cards = payload.cards
          cards.forEach(function(card) {
            if(card.buttonOption) {
              let data = JSON.parse(card.buttons[0].payload)
              if (data[0].blockUniqueId === blockId) {
                console.log('condition true')
                card.buttonOption = null
                card.buttons = []
              }
            }

          })
        }
      })
    })
    this.props.updateParentState({blocks: blocks})
  }

  onDelete () {
    console.log('carouselCards', this.state.carouselCards)
    this.deleteButtonOnCards(this.props.block.uniqueId)
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
      let sidebarItems = this.props.sidebarItems.filter((item) => !blockUniqueIds.includes(item.id.toString()))
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

  addOption (title, action, uniqueId, additionalActions) {
    const titles = this.props.blocks.map((item) => item.title.toLowerCase())
    if (action === 'create' && titles.indexOf(title.toLowerCase()) > -1) {
      this.props.alertMsg.error('A block with this title already exists. Please choose a diffrent title')
    } else {
      const options = this.state.quickReplies
      let option = {
          content_type: 'text',
          title
      }
      if (action === 'link') {
        if (additionalActions) {
          option = {
            title,
            query: additionalActions.query,
            keyboardInputAllowed: additionalActions.keyboardInputAllowed,
            skipAllowed: additionalActions.skipAllowed,
            blockId: uniqueId
          }
          if (!additionalActions.skipAllowed.blockId) {
            const skipId = '' + new Date().getTime() + 100
            const newSkipBlock = {
              title: additionalActions.skipAllowed.messageBlockTitle,
              payload: [],
              uniqueId: skipId,
              triggers: [additionalActions.skipAllowed.messageBlockTitle.toLowerCase()]
            }
            const newSkipSidebarItem = {
              title: additionalActions.skipAllowed.messageBlockTitle,
              isParent: false,
              id: skipId,
              parentId: this.props.block.uniqueId
            }
            const currentBlock = this.props.block
            const sidebarItems = this.props.sidebarItems
            const index = sidebarItems.findIndex(
              (item) => item.id.toString() === this.props.block.uniqueId.toString()
            )
            sidebarItems[index].isParent = true
            const blocks = [...this.props.blocks, newSkipBlock]
            const completed = blocks.filter((item) => item.payload.length > 0).length
            const progress = Math.floor((completed / blocks.length) * 100)
            this.props.updateParentState({
              blocks,
              currentBlock,
              progress,
              sidebarItems: [...sidebarItems, newSkipSidebarItem],
              unsavedChanges: true
            })
          }
        } else {
          option.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId, parentBlockTitle: this.props.block.title}])
        }
        options.push(option)
      } else if (action === 'create') {
        const id = new Date().getTime()
        const newBlock = {title, payload: [], uniqueId: id, triggers: [title.toLowerCase()]}
        const newSidebarItem = { title, isParent: false, id, parentId: this.props.block.uniqueId }
        let newSkipBlock = null
        let newSkipSidebarItem = null
        if (additionalActions && !additionalActions.skipAllowed.blockId) {
          const skipId = '' + new Date().getTime() + 100
          newSkipBlock = {
            title: additionalActions.skipAllowed.messageBlockTitle,
            payload: [],
            uniqueId: skipId,
            triggers: [additionalActions.skipAllowed.messageBlockTitle.toLowerCase()]
          }
          newSkipSidebarItem = {
            title: additionalActions.skipAllowed.messageBlockTitle,
            isParent: false,
            id: skipId,
            parentId: this.props.block.uniqueId
          }
        }
        const sidebarItems = this.props.sidebarItems
        const index = sidebarItems.findIndex((item) => item.id.toString() === this.props.block.uniqueId.toString())
        sidebarItems[index].isParent = true
        const blocks = [...this.props.blocks, newBlock]
        if (newSkipBlock) {
          blocks.push(newSkipBlock)
        }
        const completed = blocks.filter((item) => item.payload.length > 0).length
        const progress = Math.floor((completed / blocks.length) * 100)
        if (additionalActions) {
          option = {
            title,
            query: additionalActions.query,
            keyboardInputAllowed: additionalActions.keyboardInputAllowed,
            skipAllowed: newSkipBlock ? { ...additionalActions.skipAllowed, blockId: newSkipBlock.uniqueId } : additionalActions.skipAllowed,
            blockId: id
          }
        } else {
          option.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: id, payloadAction: 'create', parentBlockTitle: this.props.block.title}])
        }
        options.push(option)
        const currentBlock = this.props.block
        if (currentBlock.payload.length > 0) {
          currentBlock.payload[currentBlock.payload.length - 1].quickReplies = options
        } else {
          currentBlock.payload.push({quickReplies: options})
        }
        const newSidebarItems = [...sidebarItems, newSidebarItem]
        if (newSkipSidebarItem) {
          newSidebarItems.push(newSkipSidebarItem)
        }
        this.props.updateParentState({
          blocks,
          currentBlock,
          progress,
          sidebarItems: newSidebarItems,
          unsavedChanges: true
        })
      }
      this.setState({quickReplies: options, additionalActions})
    }
  }

  updateCarouselCards (cards, carouselType) {
    const blocks = [...this.props.blocks]
    const sidebarItems = [...this.props.sidebarItems]
    let carouselCards = [...cards]
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].buttonOption) {
        carouselCards[i].buttons = []
        continue
      }
      const buttonTitle = cards[i].buttonOption.buttonTitle
      const blockTitle = cards[i].buttonOption.blockTitle
      const action = cards[i].buttonOption.action
      const uniqueId = cards[i].buttonOption.blockId

      let addingNew = true
      if (this.state.carouselCards) {
        for (let j = 0; j < this.state.carouselCards.length; j++) {
          if (this.state.carouselCards[j].buttons[0]) {
            const buttonPayload = JSON.parse(this.state.carouselCards[j].buttons[0].payload)
            if ('' + buttonPayload[0].blockUniqueId === ''+uniqueId) {
              addingNew = false
              break
            }
          }
        }
      }
      const button = {
        type: 'postback',
        title: buttonTitle
      }
      if (addingNew) {
        if (action === 'link') {
          button.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId, parentBlockTitle: this.props.block.title}])
          carouselCards[i].buttons = [button]
        } else if (action === 'create') {
          const id = new Date().getTime() + i
          const newBlock = {title: blockTitle, payload: [], uniqueId: id, triggers: [blockTitle.toLowerCase()]}
          const index = sidebarItems.findIndex((item) => item.id.toString() === this.props.block.uniqueId.toString())
          sidebarItems[index].isParent = true
          const newSidebarItem = {title: blockTitle, isParent: false, id, parentId: this.props.block.uniqueId}
          sidebarItems.push(newSidebarItem)
          blocks.push(newBlock)
          button.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: id, payloadAction: 'create', parentBlockTitle: this.props.block.title}])
          carouselCards[i].buttons = [button]
        }
      } else {
        button.payload = JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId, parentBlockTitle: this.props.block.title}])
        carouselCards[i].buttons = [button]
      }
    }
    const completed = blocks.filter((item) => item.payload.length > 0).length
    const progress = Math.floor((completed / blocks.length) * 100)
    this.setState({carouselCards, selectedComponent: carouselType}, () => {
      const currentBlock = this.props.block
      const payload = this.preparePayload(this.state)
      currentBlock.payload = payload
      this.props.updateParentState({
        currentBlock,
        blocks,
        progress,
        sidebarItems,
        unsavedChanges: true
      })
    })
  }

  updateOption (uniqueId, index, title, additionalActions) {
    let options = []
    options = this.state.quickReplies
    options[index].title = title
    if (options[index].query) {
      if (additionalActions) {
        options[index].blockId = uniqueId
        options[index].query = additionalActions.query
        options[index].skipAllowed = additionalActions.skipAllowed
        options[index].keyboardInputAllowed = additionalActions.keyboardInputAllowed
      } else {
        options[index] = {
          title: options[index].title,
          payload: JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId, parentBlockTitle: this.props.block.title}])
        }
      }
    }
    if (options[index].payload) {
      const payload = JSON.parse(options[index].payload)
      payload[0].blockUniqueId = uniqueId
      options[index].payload = JSON.stringify(payload)
    }
    this.setState({quickReplies: options})
  }

  removeOption (uniqueId, index) {
    let additionalActions = this.state.additionalActions
    let options = []
    options = this.state.quickReplies
    if (this.state.quickReplies[index].query) {
      additionalActions = null
    }
    options.splice(index, 1)
    const currentBlock = this.props.block
    if (currentBlock.payload.length > 0) {
      currentBlock.payload[currentBlock.payload.length - 1].quickReplies = options
    } else {
      currentBlock.payload.push({quickReplies: options})
    }
    this.setState({quickReplies: options, additionalActions})
    this.props.updateParentState({currentBlock, unsavedChanges: true})
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

  checkEmptyBlock () {
    const { block, blocks } = this.props
    const emptyBlocks = blocks.filter((item) => item.payload.length === 0 && item.uniqueId.toString() !== block.uniqueId.toString())
    if (emptyBlocks.length > 0) {
      return true
    } else {
      return false
    }
  }

  isOrphanBlock () {
    const currentBlock = this.props.block
    if (!currentBlock._id || this.props.chatbot.startingBlockId === currentBlock._id) {
      return false
    } else {
      let temp = this.props.blocks.filter((item) => item.payload.length > 0)
      temp = temp.map((item) => item.payload[item.payload.length - 1].quickReplies)
      temp = temp.filter((item) => item.length > 0)
      temp = [].concat.apply([], temp) // merge array of arrays into single arary
      temp = temp.map((item) => JSON.parse(item.payload)[0])
      const ids = temp.map((item) => item.blockUniqueId.toString())
      if (ids.includes(currentBlock.uniqueId.toString())) {
        return false
      } else {
        return true
      }
    }
  }

  canDeleteBlock () {
    if (this.props.block._id === 'welcome-id' && this.props.block.payload.length === 0) {
      return false
    } else {
      return true
    }
  }

  linkBlock (title) {
    if (['talk_to_agent'].includes(title)) {
      let quickReplies = this.state.quickReplies
      quickReplies.push({
        content_type: 'text',
        title: 'Talk to Agent',
        payload: JSON.stringify([{action: '_chatbot', payloadAction: 'talk_to_agent', chatbotId: this.props.chatbot._id, parentBlockTitle: this.props.block.title}])
      })

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
    if (title === 'talk_to_agent') {
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.block) {
      this.setStateData(nextProps.block)
    }
  }

  onSelectComponent (component) {
    if (component === 'carousel') {
      this.showCarouselModalTrigger.click()
    } else if (component === 'linkCarousel') {
      this.showLinkCarouselModalTrigger.click()
    } else {
      this.setState({selectedComponent: component})
    }
  }

  getRemoveModalContent () {
    switch (this.state.selectedComponent) {
      case 'attachment': {
        return {
          title: 'Remove Attachment',
          description: 'Are you sure you want to remove this attachment? You will lose any data you have inputted.'
        }
      }
      case 'carousel': {
        return {
          title: 'Remove Carousel',
          description: 'Are you sure you want to remove this carousel? You will lose any data you have inputted.'
        }
      }
      case 'linkCarousel': {
        return {
          title: 'Remove Link Carousel',
          description: 'Are you sure you want to remove this link carousel? You will lose any data you have inputted.'
        }
      }
      default: {
        return {
          title: 'Remove Component',
          description: 'Are you sure you want to remove this component? You will lose any data you have inputted.'
        }
      }
    }
  }

  onRemoveComponent (force) {
    if (this.state.selectedComponent === 'attachment') {
      if (!force && Object.keys(this.state.attachment).length > 0) {
        this.removeComponentTrigger.click()
      } else {
        this.setState({selectedComponent: '', attachment: {}})
      }
    } else if (this.state.selectedComponent === 'carousel' || this.state.selectedComponent === 'linkCarousel') {
      if (!force && this.state.carouselCards) {
        this.removeComponentTrigger.click()
      } else {
        this.setState({selectedComponent: '', carouselCards: null})
      }
    }
  }

  render () {
    console.log('this.props.block', this.props.block)
    const removeModalContent = this.getRemoveModalContent()
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-9'>
        <div style={{margin: '0px', height: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet-mobile'>
          <HEADER
            title={this.props.block.title}
            onDelete={this.onDelete}
            alertMsg={this.props.alertMsg}
            onRename={this.renameBlock}
            blocks={this.props.blocks}
            canDelete={this.canDeleteBlock()}
          />
          <div id='_chatbot_message_area' style={{padding: '15px', overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
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
            {
              !this.state.selectedComponent &&
              <>
                <COMPONENTSELECTION onSelectComponent={this.onSelectComponent}/>
                <div className='m--space-10' />
              </>
            }
            {
              this.state.selectedComponent === 'attachment' &&
              <ATTACHMENTAREA
                attachment={this.state.attachment}
                alertMsg={this.props.alertMsg}
                chatbot={this.props.chatbot}
                uploadAttachment={this.props.uploadAttachment}
                handleAttachment={this.props.handleAttachment}
                updateParentState={this.updateState}
                checkWhitelistedDomains={this.props.checkWhitelistedDomains}
                toggleWhitelistModal={this.props.toggleWhitelistModal}
                onRemove={() => this.onRemoveComponent(false)}
              />
            }
            {
              this.state.selectedComponent === 'carousel' &&
              <CAROUSELAREA
                title="Carousel:"
                buttonTitle="Edit Carousel"
                onRemove={() => this.onRemoveComponent(false)}
                onClick={() => this.showCarouselModalTrigger.click()}
              />
            }
            {
              this.state.selectedComponent === 'linkCarousel' &&
              <CAROUSELAREA
                title="Link Carousel:"
                buttonTitle="Edit Link Carousel"
                onRemove={() => this.onRemoveComponent(false)}
                onClick={() => this.showLinkCarouselModalTrigger.click()}
              />
            }
            <div className='m--space-10' />
            {
              (this.state.text || Object.keys(this.state.attachment).length > 0 || this.state.carouselCards) &&
              <MOREOPTIONS
                text={this.state.text}
                data={this.state.quickReplies}
                alertMsg={this.props.alertMsg}
                blocks={this.props.blocks}
                addOption={this.addOption}
                removeOption={this.removeOption}
                updateOption={this.updateOption}
                additionalActions={this.state.additionalActions}
              />
            }
            {
              this.props.chatbot.published && this.props.block.stats &&
              (this.props.block.stats.urlBtnClickedCount > 0 || this.props.block.stats.sentCount > 0) &&
              <MESSAGEBLOCKUSAGE
                urlBtnClickedCount={this.props.block.stats ? this.props.block.stats.urlBtnClickedCount : 0}
                sentCount={this.props.block.stats ? this.props.block.stats.sentCount : 0}
              />
            }
            <div className='m--space-10' />
          </div>
          <button style={{display: 'none'}} ref={(el) => this.showCarouselModalTrigger = el} data-toggle='modal' data-target='#_carousel_modal' />
          <CAROUSELMODAL
            id = '_carousel_modal'
            title = 'Edit Carousel'
            chatbot={this.props.chatbot}
            uploadAttachment={this.props.uploadAttachment}
            updateParentState={this.updateState}
            cards={this.state.carouselCards}
            alertMsg={this.props.alertMsg}
            blocks={this.props.blocks}
            updateCarouselCards={this.updateCarouselCards}
            currentBlock={this.props.block}
          />
          <button style={{display: 'none'}} ref={(el) => this.showLinkCarouselModalTrigger = el} data-toggle='modal' data-target='#_link_carousel_modal' />
          <LinkCarouselModal
            id = '_link_carousel_modal'
            title = 'Edit Link Carousel'
            chatbot={this.props.chatbot}
            uploadAttachment={this.props.uploadAttachment}
            updateParentState={this.updateState}
            cards={this.state.carouselCards}
            alertMsg={this.props.alertMsg}
            blocks={this.props.blocks}
            updateCarouselCards={this.updateCarouselCards}
            urlMetaData={this.props.urlMetaData}
            currentBlock={this.props.block}
          />
          <FOOTER
            showPrevious={false}
            showNext={true}
            onNext={this.onNext}
            disableNext={this.state.disableNext}
            onPrevious={() => {}}
            emptyBlocks={this.checkEmptyBlock()}
            linkBlock={this.linkBlock}
            removeLink={this.removeLink}
            currentBlock={this.props.block}
          />
          <button style={{display: 'none'}} ref={(el) => this.removeComponentTrigger = el} data-toggle='modal' data-target='#_remove_component' />
          <CONFIRMATIONMODAL
            id='_remove_component'
            title={removeModalContent.title}
            description={removeModalContent.description}
            onConfirm={() => this.onRemoveComponent(true)}
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
  'checkWhitelistedDomains': PropTypes.func.isRequired,
  'toggleWhitelistModal': PropTypes.func.isRequired,
  'allTriggers': PropTypes.array.isRequired,
  'urlMetaData': PropTypes.func.isRequired
}

export default MessageArea
