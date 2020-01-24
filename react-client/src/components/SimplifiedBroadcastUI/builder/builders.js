import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import PropTypes from 'prop-types'

import {validateYoutubeURL} from '../../../utility/utils'

import { loadTags } from '../../../redux/actions/tags.actions'
import { fetchAllSequence } from '../../../redux/actions/sequence.action'
import { loadBroadcastsList } from '../../../redux/actions/templates.actions'

import BASICBUILDER from './basicBuilder'
import FLOWBUILDER from './flowBuilder'

import Audio from '../PreviewComponents/Audio'
import File from '../PreviewComponents/File'
import Text from '../PreviewComponents/Text'
import Card from '../PreviewComponents/Card'
import Gallery from '../PreviewComponents/Gallery'
import Media from '../PreviewComponents/Media'

import TextModal from '../TextModal'
import CardModal from '../CardModal'
import ImageModal from '../ImageModal'
import FileModal from '../FileModal'
import AudioModal from '../AudioModal'
import MediaModal from '../MediaModal'
import LinkCarousel from '../LinkCarousel'
import QuickReplies from '../QuickReplies'
import UserInputModal from '../UserInputModal'
import UserInput from '../PreviewComponents/UserInput'

import CustomFields from '../../customFields/customfields'

class Builders extends React.Component {
  constructor (props, context) {
    super(props, context)
    let hiddenComponents = this.props.hiddenComponents.map(component => component.toLowerCase())
    let currentId = new Date().getTime()
    let lists = {
    }
    lists[currentId] = []
    let quickReplies = {}
    quickReplies[currentId] = []
    this.state = {
      customFields: [],
      lists,
      quickReplies,
      quickRepliesComponents: {},
      broadcast: this.props.broadcast.slice(),
      isShowingModal: false,
      convoTitle: this.props.convoTitle,
      pageId: this.props.pageId.pageId,
      hiddenComponents: hiddenComponents,
      componentType: '',
      linkedMessages: this.props.linkedMessages ? this.props.linkedMessages : [{title: this.props.convoTitle, id: currentId, messageContent: []}],
      unlinkedMessages: this.props.unlinkedMessages ? this.props.unlinkedMessages : [],
      currentId,
      quickRepliesIndex: -1,
      editingFlowBuilder: false,
      showGSModal: false
    }
    this.defaultTitle = this.props.convoTitle
    this.reset = this.reset.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.handleMedia = this.handleMedia.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleUserInput = this.handleUserInput.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.addComponent = this.addComponent.bind(this)
    this.getComponent = this.getComponent.bind(this)
    this.showAddComponentModal = this.showAddComponentModal.bind(this)
    this.closeAddComponentModal = this.closeAddComponentModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.updateList = this.updateList.bind(this)
    this.showCloseModalAlertDialog = this.showCloseModalAlertDialog.bind(this)
    this.closeModalAlertDialog = this.closeModalAlertDialog.bind(this)
    this.updateQuickReplies = this.updateQuickReplies.bind(this)
    this.appendQuickRepliesToEnd = this.appendQuickRepliesToEnd.bind(this)
    this.getItems = this.getItems.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.createLinkedMessagesFromButtons = this.createLinkedMessagesFromButtons.bind(this)
    this.removeLinkedMessages = this.removeLinkedMessages.bind(this)
    this.addDeletePayloads = this.addDeletePayloads.bind(this)
    this.addLinkedMessage = this.addLinkedMessage.bind(this)
    this.editLinkedMessage = this.editLinkedMessage.bind(this)
    this.updateLinkedMessagesPayload = this.updateLinkedMessagesPayload.bind(this)
    this.updateLinkedMessagesTitle = this.updateLinkedMessagesTitle.bind(this)
    this.changeMessage = this.changeMessage.bind(this)
    this.getQuickReplies = this.getQuickReplies.bind(this)
    this.getCurrentMessage = this.getCurrentMessage.bind(this)
    this.removeMessage = this.removeMessage.bind(this)
    this.toggleGSModal = this.toggleGSModal.bind(this)
    this.closeGSModal = this.closeGSModal.bind(this)
    this.deconstructUserInput = this.deconstructUserInput.bind(this)
    this.onLoadCustomFields = this.onLoadCustomFields.bind(this)
    this.createLinkedMessagesFromQuickReplies = this.createLinkedMessagesFromQuickReplies.bind(this)

    this.GSModalContent = null

    if (props.setReset) {
      props.setReset(this.reset)
    }

    this.props.loadBroadcastsList()
    this.props.loadTags()
    this.props.fetchAllSequence()
    console.log('builders props in constructor', this.props)
  }

  onLoadCustomFields (customFields) {
    this.setState({customFields})
  }

  toggleGSModal (value, content) {
    console.log('show toggleGSModal called in genericMessage')
    this.setState({showGSModal: value})
    this.GSModalContent = content
  }

  closeGSModal () {
    this.setState({showGSModal: false})
    this.refs.ActionModal.click()
  }

  getCurrentMessage () {
    let messages = this.state.linkedMessages.concat(this.state.unlinkedMessages)
    let messageIndex = messages.findIndex(m => m.id === this.state.currentId)
    if (messageIndex > -1) {
      return messages[messageIndex]
    } else {
      return null
    }
  }

  changeMessage (id) {
    return new Promise ((resolve, reject) => {
      if (this.state.currentId !== id) {
        let messages = this.state.linkedMessages.concat(this.state.unlinkedMessages)
        let messageIndex = messages.findIndex(m => m.id === id)
        if (messageIndex > -1) {
          console.log('changing message', this.state.linkedMessages[messageIndex])
          this.setState({currentId: id}, () => {
            // let filteredData = this.state.linkedMessages.concat(this.state.unlinkedMessages).filter((lm) => lm.id === id)
            // let list = filteredData.length > 0 ? filteredData[0].messageContent : []
            // this.initializeList(list)
            this.handleChange({convoTitle: messages[messageIndex].title}, {changingMessage: true})
            this.handleChange({broadcast: messages[messageIndex].messageContent}, {changingMessage: true})
            resolve()
          })
        }
      }
    })
  }

  updateLinkedMessagesPayload (broadcast) {
    let linkedMessages = this.state.linkedMessages
    let lists = this.state.lists
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].messageContent = broadcast
        if (lists[this.state.currentId].length !== linkedMessages[i].messageContent.length) {
          let temp = []
          for (let j = 0; j < broadcast.length; j++) {
            let component = this.getComponent(broadcast[j]).component
            temp.push({content: component})
          }
          lists[this.state.currentId] = temp
          console.log('lists updated', lists)
        }
      }
    }

    let unlinkedMessages = this.state.unlinkedMessages
    for (let i = unlinkedMessages.length-1 ; i >= 0; i--) {
      if (unlinkedMessages[i].id === this.state.currentId) {
        unlinkedMessages[i].messageContent = broadcast
        if (!lists[this.state.currentId]) {
          let temp = []
          for (let j = 0; j < broadcast.length; j++) {
            let component = this.getComponent(broadcast[j]).component
            temp.push({content: component})
          }
          lists[this.state.currentId] = temp
          console.log('lists updated', lists)
        }
      }
    }
    this.setState({linkedMessages, unlinkedMessages, lists})
  }

  editLinkedMessage (button) {
    let linkedMessages = this.state.linkedMessages
    let buttonPayload = JSON.parse(button.payload)
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === buttonPayload.blockUniqueId) {
        // linkedMessages[i].title = button.title
        linkedMessages[i].parentId = this.state.currentId
        linkedMessages[i].linkedButton = button
      }
    }
    this.setState({linkedMessages})
  }

  editLinkedMessageForQuickReply (button) {
    let linkedMessages = this.state.linkedMessages
    let buttonPayload = JSON.parse(button.payload)
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      for (let j = 0; j < buttonPayload.length; j++) {
        if (linkedMessages[i].id === buttonPayload[j].blockUniqueId) {
          // linkedMessages[i].title = button.title
          linkedMessages[i].parentId = this.state.currentId
          linkedMessages[i].linkedButton = button
        }
      }
    }
    this.setState({linkedMessages})
  }

  updateLinkedMessagesTitle (title) {
    let linkedMessages = this.state.linkedMessages
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].title = title
        // linkedMessages[i].linkedButton.title = title
      }
    }
    this.setState({linkedMessages, convoTitle: title})
  }

  handleChange (broadcast, event) {
    console.log('handleChange broadcast in basicBuilder', broadcast)
    console.log('handleChange event in basciBuilder', event)
    if (broadcast.convoTitle) {
      this.updateLinkedMessagesTitle(broadcast.convoTitle)
      this.props.handleChange({convoTitle: broadcast.convoTitle, linkedMessages: this.state.linkedMessages})
    } else {
      if (!event.changingMessage) {
        broadcast = broadcast.broadcast
        if (event && event.deletePayload) {
          console.log('deletePayload', event)
          this.removeLinkedMessages(event.deletePayload)
        }
        this.updateLinkedMessagesPayload (broadcast)
        for (let i = 0; i < broadcast.length; i++) {
          let broadcastComponent = broadcast[i]
          console.log('broadcastComponent', broadcastComponent)
          if (broadcastComponent.buttons) {
            this.createLinkedMessagesFromButtons(broadcastComponent)
          }
          if (broadcastComponent.cards) {
            for (let j = 0; j < broadcastComponent.cards.length; j++) {
              let card = broadcastComponent.cards[j]
              this.createLinkedMessagesFromButtons(card)
            }
          }
          if (broadcastComponent.quickReplies && broadcastComponent.quickReplies.length > 0) {
            this.createLinkedMessagesFromQuickReplies(broadcastComponent)
          }
        }
        this.props.handleChange({broadcast: broadcast, linkedMessages: this.deconstructUserInput(this.state.linkedMessages), unlinkedMessages: this.state.unlinkedMessages})
      }
    }
  }

  deconstructUserInput (messages) {
    //debugger;
    let userInputComponents = []
    let finalMessages = JSON.parse(JSON.stringify(messages))
    for (let x = 0; x < finalMessages.length; x++) {
      let message = finalMessages[x].messageContent
      for (let y = 0; y < message.length; y++) {
        let component = message[y]
        if (component.componentType === 'userInput' && component.questions) {
          finalMessages[x].messageContent.splice(y, 1)
          let temp = {}
          for (let i = 0; i < component.questions.length; i++) {
            temp = JSON.parse(JSON.stringify({...component, ...component.questions[i]}))
            delete temp.questions
            for (let j = 0; j < component.action.mapping.length; j++) {
              if (component.action.mapping[j].question === component.questions[i].question) {
                let mapping = component.action.mapping[j]
                if (component.action.type === 'custom_fields') {
                  temp.action.customFieldId = mapping.customFieldId
                } else if (component.action.type === 'google_sheets'){
                  temp.action.googleSheetColumn = mapping.googleSheetColumn
                } else if (component.action.type === 'hubspot'){
                  temp.action.hubspotColumn = mapping.hubspotColumn
                }
              }
            }
            delete temp.action.mapping
            userInputComponents.push(temp)
            finalMessages[x].messageContent.splice(y+i, 0, temp)
          }
        }
      }
    }
    console.log('deconstruct userInputComponents', finalMessages)
    return finalMessages
  }

  createLinkedMessagesFromButtons(broadcastComponent) {
    let buttons = broadcastComponent.buttons
    for (let j = 0; j < buttons.length; j++) {
      let button = buttons[j]
      if (button.type === 'postback' && button.payload === null) {
        console.log('found create new message button')
        this.addLinkedMessage(button)
      } else {
        if (typeof button.payload === 'string') {
          this.editLinkedMessage(button)
        }
      }
    }
  }

  createLinkedMessagesFromQuickReplies(broadcastComponent) {
    let quickReplies = broadcastComponent.quickReplies
    console.log('in createLinkedMessagesFromQuickReplies', quickReplies)
    for (let j = 0; j < quickReplies.length; j++) {
      let quickReply = quickReplies[j]
      let payloads = JSON.parse(quickReply.payload)
      for (let a = 0; a < payloads.length; a++) {
        if (payloads[a].action === 'reply_with_a_message' && !payloads[a].blockUniqueId) {
          payloads[a].action = 'send_message_block'
          this.addLinkedMessageForQuickReply(quickReply, a)
        } else {
          // if (typeof button.payload === 'string') {
          //   this.editLinkedMessageForQuickReply(button)
          // }
        }
      }
    }
  }

  addLinkedMessageForQuickReply (quickReply, payloadIndex) {
    let id = new Date().getTime() + Math.floor(Math.random() * 100)
    let data = {
      id: id,
      title: quickReply.title,
      messageContent: [],
      linkedButton: quickReply
    }
    let payload = JSON.parse(quickReply.payload)
    payload[payloadIndex].blockUniqueId = id
    quickReply.payload = JSON.stringify(payload)
    // button.payload = JSON.stringify({
    //   blockUniqueId: id,
    //   action: 'send_message_block'
    // })
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    let quickReplies = this.state.quickReplies
    let lists = this.state.lists

    // debugger;
    let buttonFound = false
    for (let i = 0; i < linkedMessages.length; i++) {
      let message = linkedMessages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let messageContent = message.messageContent[j]
        let buttons = []
        if (messageContent.quickReplies && messageContent.quickReplies.length > 0) {
          buttons = messageContent.quickReplies
        }
        for (let k = 0; k < buttons.length; k++) {
          let payloads = JSON.parse(buttons[k].payload)
          for (let a = 0; a < payloads.length; a++) {
            if (payloads[a].action === 'reply_with_a_message') {
              buttonFound = true
              break
            }
          }
        }
        if (buttonFound) {
          break
        }
      }
      if (buttonFound) {
        break
      }
    }
    console.log('buttonFound', buttonFound)
    console.log('this.state.currentId', this.state.currentId)
    if (buttonFound) {
      data.parentId = this.state.currentId
      linkedMessages.push(data)
    } else {
      data.parentId = this.state.currentId
      unlinkedMessages.push(data)
    }
    lists[id] = []
    quickReplies[id] = []
    this.setState({linkedMessages, lists, quickReplies})
  }

  removeLinkedMessages (deletePayload) {
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    deletePayload = deletePayload.map(payload => {
      if (payload && typeof payload === 'string') {
        return JSON.parse(payload).blockUniqueId
      }
      return null
    }).filter(payload => !!payload)
    console.log('removeLinkedMessages', deletePayload)
    for (let i = 0; i < deletePayload.length; i++) {
      for (let j = linkedMessages.length-1; j >= 0; j--) {
        if (linkedMessages[j].id === deletePayload[i]) {
          console.log(`deleting linkedMessage ${j}`, linkedMessages)

          for (let m = 0; m < linkedMessages[j].messageContent.length; m++) {
            let component = linkedMessages[j].messageContent[m]
            if (component.buttons) {
              let buttons = component.buttons
              this.addDeletePayloads(deletePayload, buttons)
            }
            if (component.cards) {
              let cards = component.cards
              for (let k = 0; k < cards.length; k++) {
                if (cards[k].buttons) {
                  this.addDeletePayloads(deletePayload, cards[k].buttons)
                }
              }
            }
          }
          unlinkedMessages.push(linkedMessages[j])
          linkedMessages.splice(j, 1)
        }
      }
    }
    this.setState({linkedMessages, unlinkedMessages})
  }

  addDeletePayloads (deletePayload, buttons) {
    for (let k = 0; k < buttons.length; k++) {
      let buttonPayload = JSON.parse(buttons[k].payload)
      if (buttons[k].type === 'postback' && buttonPayload.blockUniqueId) {
        deletePayload.push(buttonPayload.blockUniqueId)
      }
    }
  }

  addLinkedMessage (button) {
    let id = new Date().getTime() + Math.floor(Math.random() * 100)
    let data = {
      id,
      title: button.title,
      messageContent: [],
      linkedButton: button
    }
    button.payload = JSON.stringify({
      blockUniqueId: id,
      action: 'send_message_block'
    })
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    let quickReplies = this.state.quickReplies
    let lists = this.state.lists
    console.log('linkedMessages in buttons', linkedMessages)

    // debugger;
    let buttonFound = false
    for (let i = 0; i < linkedMessages.length; i++) {
      let message = linkedMessages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let messageContent = message.messageContent[j]
        let buttons = []
        if (messageContent.cards) {
          for (let m = 0;  m < messageContent.cards.length; m++) {
            buttons = buttons.concat(messageContent.cards[m].buttons)
          }
        } else if (messageContent.buttons) {
          buttons = messageContent.buttons
        }
        for (let k = 0; k < buttons.length; k++) {
          let buttonId = buttons[k].id
          if (buttonId === button.id) {
            buttonFound = true
            break
          }
        }
        if (buttonFound) {
          break
        }
      }
      if (buttonFound) {
        break
      }
    }

    if (buttonFound) {
      data.parentId = this.state.currentId
      linkedMessages.push(data)
    } else {
      data.parentId = this.state.currentId
      unlinkedMessages.push(data)
    }
    lists[id] = []
    quickReplies[id] = []
    this.setState({linkedMessages, lists, quickReplies})
  }

  updateQuickReplies (quickRepliesValue, quickRepliesIndex) {
    return new Promise ((resolve, reject) => {
      console.log('updateQuickReplies', quickRepliesValue)
      let quickReplies = this.state.quickReplies
      let currentMessage = this.getCurrentMessage()
      console.log('updateQuickReplies quickRepliesIndex', quickRepliesIndex)
      console.log('currentMessage', currentMessage)
      let broadcast = this.appendQuickRepliesToEnd(currentMessage.messageContent, quickRepliesValue)
      console.log('broadcast after updating quick replies', broadcast)
      quickReplies[this.state.currentId] = quickRepliesValue
      this.setState({quickReplies, broadcast, quickRepliesIndex}, () => {
        resolve()
      })
      this.handleChange({broadcast}, {})
    })
  }

  appendQuickRepliesToEnd (broadcast, quickReplies) {
    let quickRepliesIndex = broadcast.findIndex(x => !!x.quickReplies)
    console.log('quickRepliesIndex', quickRepliesIndex)
    if (quickRepliesIndex > -1) {
      delete broadcast[quickRepliesIndex].quickReplies
    }
    broadcast[broadcast.length-1].quickReplies = quickReplies
    console.log('appendQuickRepliesToEnd', broadcast)
    return broadcast
  }

  componentDidMount () {
    console.log('componentDidMount for Builder', this.state)
    this.props.handleChange({linkedMessages: this.state.linkedMessages, unlinkedMessages: this.state.unlinkedMessages})
    if (this.state.broadcast && this.state.broadcast.length > 0) {
      this.initializeList(this.state.linkedMessages.concat(this.state.unlinkedMessages).filter((lm) => lm.id === this.state.currentId)[0].messageContent)
    }
    console.log('genericMessage props in end of componentDidMount', this.props)
  }

  initializeList (broadcast) {
    console.log('initializeList', broadcast)
    let temp = []
    for (var i = 0; i < broadcast.length; i++) {
      let component = this.getComponent(broadcast[i]).component
      temp.push({content: component})
    }
    this.setState({list: temp, broadcast})
    this.handleChange({broadcast}, {})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  reset (showDialog = true) {
    if (showDialog) {
      this.showResetAlertDialog()
    } else {
      this.newConvo(true)
    }
  }

  showResetAlertDialog () {
    if (this.state.broadcast.length > 0 || this.state.lists[this.state.currentId].length > 0) {
      this.setState({isShowingModalResetAlert: true})
      this.refs.resetModal.click()
    }
  }

  closeResetAlertDialog () {
    this.setState({isShowingModalResetAlert: false})
  }

  closeModalAlertDialog () {
    this.setState({isShowingModalCloseAlert: false})
  }

  showCloseModalAlertDialog () {
    this.setState({isShowingModalCloseAlert: true})
    this.refs.lossData.click()
  }

  showAddComponentModal (componentType, editData) {
    console.log('showAddComponentModal componentType', componentType)
    console.log('showAddComponentModal editData', editData)
    console.log('component limit', this.props.componentLimit)
    document.body.style.overflow = 'hidden'
    if (!editData && this.props.componentLimit && this.state.lists[this.state.currentId].length === this.props.componentLimit) {
      this.msg.info(`You can only add ${this.props.componentLimit} components in this message`)
    } else {
      this.setState({isShowingAddComponentModal: true, componentType, editData})
      this.refs.singleModal.click()
      // $(document).on('hide.bs.modal','#singleModal', function () {
      //   alert('hi');
      // })
    }
  }

  closeAddComponentModal () {
    this.setState({isShowingAddComponentModal: false, editData: null})
    this.refs.singleModal.click()
  }

  showDialog () {
    this.setState({isShowingModal: true})
    this.refs.rename.click()
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    console.log('in renameTitle')
    console.log('default title', this.defaultTitle)
    if (this.titleConvo.value === '') {
      return
    }
    console.log('renaming title')
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
    this.handleChange({convoTitle: this.titleConvo.value}, {})
  }

  handleText (obj) {
    console.log('handleText', obj)
    var temp = this.getCurrentMessage().messageContent
    console.log('handleText temp', temp)
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        temp[a].text = obj.text
        if (obj.buttons.length > 0) {
          temp[a].buttons = obj.buttons
        } else {
          delete temp[a].buttons
        }
        isPresent = true
      }
    }

    if (!isPresent) {
      if (obj.buttons.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: obj.componentName, buttons: obj.buttons})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: obj.componentName})
      }
    }
    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    console.log('handleText temp', temp)
    console.log('handleText state', this.state)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  // handleUserInput (obj) {
  //   //debugger;
  //   console.log('handleUserInput', obj)
  //   var temp = this.getCurrentMessage().messageContent
  //   console.log('handleUserInput temp', temp)
  //   var isPresent = false

  //   for (let i = 0; i < obj.questions.length; i++) {
  //     for (let a = 0; a < temp.length; a++) {
  //       if (temp[a].id === obj.questions[i].id) {
  //         temp[a].question = obj.questions[i]
  //         for (let j = 0; j < obj.action.mapping.length; j++) {
  //           let mapping = obj.action.mapping[j]
  //           if (obj.questions[i].question === mapping.question) {
  //             if (obj.action.type === 'custom_fields') {
  //               temp[a].action.customFieldId = mapping.customFieldId
  //             } else if (obj.action.type === 'google_sheets'){
  //               temp[a].action.googleSheetColumn = mapping.googleSheetColumn
  //             } else if (obj.action.type === 'hubspot'){
  //               temp[a].action.hubspotColumn = mapping.hubspotColumn
  //             }
  //           }
  //         }
  //         isPresent = true
  //       }
  //     }
  //     if (!isPresent) {
  //       let action = JSON.parse(JSON.stringify(obj.action))
  //       for (let k = 0; k < action.mapping.length; k++) {
  //         console.log('action.mapping', action.mapping)
  //         console.log('k', k)
  //         console.log('action.mapping[k]', action.mapping[k])
  //         let mappingData = action.mapping[k]
  //         if (obj.questions[i].question === mappingData.question) {
  //           if (obj.action.type === 'custom_fields') {
  //             action.customFieldId = mappingData.customFieldId
  //           } else if (obj.action.type === 'google_sheets'){
  //             action.googleSheetColumn = mappingData.googleSheetColumn
  //           } else if (obj.action.type === 'hubspot'){
  //             action.hubspotColumn = mappingData.hubspotColumn
  //           }
  //         }
  //       }
  //       delete action.mapping
  //       temp.push({
  //         id: obj.id,
  //         ...obj.questions[i],
  //         componentType: 'userInput',
  //         action: action})
  //       console.log('userInput temp add', temp)
  //     }
  //   }
  //   temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
  //   console.log('handleUserInput temp', temp)
  //   console.log('handleUserInput state', this.state)
  //   this.setState({broadcast: temp})
  //   this.handleChange({broadcast: temp}, obj)
  // }

  handleUserInput (obj) {
    console.log('handleUserInput', obj)
    var temp = this.getCurrentMessage().messageContent
    console.log('handleUserInput temp', temp)
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        temp[a].questions = obj.questions
        temp[a].action = obj.action
        isPresent = true
      }
    }

    if (!isPresent) {
        temp.push({id: obj.id, questions: obj.questions, action: obj.action, componentType: 'userInput'})
    }
    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    console.log('handleUserInput temp', temp)
    console.log('handleUserInput state', this.state)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleCard (obj) {
    console.log('handleCard', obj)
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.getCurrentMessage().messageContent
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        console.log('enter in function')
        temp[a].componentType = obj.componentType
        temp[a].fileName = obj.fileName
        temp[a].fileurl = obj.fileurl
        temp[a].image_url = obj.image_url
        temp[a].size = obj.size
        temp[a].type = obj.type
        temp[a].title = obj.title
        temp[a].buttons = obj.buttons
        temp[a].description = obj.description
        temp[a].webviewsize = obj.webviewsize
        temp[a].webviewurl = obj.webviewurl
        temp[a].elementUrl = obj.elementUrl
        if (obj.default_action && obj.default_action !== '') {
          temp[a].default_action = obj.default_action
        } else if (temp[a].default_action) {
          console.log('delete default action')
          delete temp[a].default_action
        }
        if (temp[a].cards) {
          delete temp[a].cards
        }
        isPresent = true
      }
    }
    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    console.log('temp handleCard', temp)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleMedia (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      if (obj.error === 'file size error') {
        this.msg.error('File size cannot exceed 25MB')
        return
      }
      if (obj.error === 'invalid file') {
        this.msg.error('File is not valid')
        return
      }
    }
    var temp = this.getCurrentMessage().messageContent
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        if (obj.file) {
          temp[a].file = obj.file
        }
        temp[a].fileName = obj.fileName
        temp[a].mediaType = obj.mediaType
        temp[a].fileurl = obj.fileurl
        temp[a].image_url = obj.image_url
        temp[a].size = obj.size
        temp[a].type = obj.type
        temp[a].buttons = obj.buttons
        isPresent = true
      }
    }
    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleGallery (obj) {
    console.log('handleGallery', obj)
    var temp = this.getCurrentMessage().messageContent
    var isPresent = false
    if (obj.cards) {
      obj.cards.forEach((d) => {
        delete d.id
      })
    }
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        if (temp[a].buttons) {
          delete temp[a].buttons
        }
        temp[a].cards = obj.cards
        isPresent = true
      }
    }
    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleImage (obj) {
    var temp = this.getCurrentMessage().messageContent
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        temp[a] = obj
        isPresent = true
      }
    }

    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleFile (obj) {
    var temp = this.getCurrentMessage().messageContent
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        temp[a] = obj
        isPresent = true
      }
    }

    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies[this.state.currentId])
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  removeComponent (obj) {
    console.log('obj in removeComponent', obj)
    var temp = this.state.lists[this.state.currentId].filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.getCurrentMessage().messageContent.filter((component) => { return (component.id !== obj.id) })
    console.log('temp', temp)
    console.log('temp2', temp2)
    if (temp2.length === 0) {
      let quickReplies = this.state.quickReplies
      quickReplies[this.state.currentId] = []
      this.setState({quickReplies})
    }
    let lists = this.state.lists
    lists[this.state.currentId] = temp
    this.setState({lists})
    this.handleChange({broadcast: temp2}, obj)
  }

  newConvo (render) {
    let currentId = new Date().getTime()
    let lists = {}
    lists[currentId] = []
    let quickReplies = {}
    quickReplies[currentId] = []
    this.setState({
      lists,
      currentId,
      convoTitle: this.defaultTitle,
      quickRepliesComponents: {},
      quickRepliesIndex: -1,
      linkedMessages: [{title: this.props.convoTitle, id: currentId, messageContent: []}],
      unlinkedMessages: [],
      isShowingModalResetAlert: false
    }, () => {
      this.handleChange({convoTitle: this.defaultTitle}, {})
      this.handleChange({broadcast: []}, {})
      if (render && this.props.builderValue === 'flow') {
        this.props.rerenderFlowBuilder()
      }
    })
  }

  removeMessage () {
    console.log('removing message', this.state.currentId)
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    let lists = this.state.lists
    let quickReplies = this.state.quickReplies
    let quickRepliesComponents = this.state.quickRepliesComponents

    let messageFound = false
    for (let i = 0; i < linkedMessages.length; i++) {
      if (linkedMessages[i].id === this.state.currentId) {
        messageFound = true
        linkedMessages.splice(i,1)
        delete lists[this.state.currentId]
        delete quickReplies[this.state.currentId]
        delete quickRepliesComponents[this.state.currentId]
        break
      }
    }
    if (!messageFound) {
      for (let i = 0; i < unlinkedMessages.length; i++) {
        if (unlinkedMessages[i].id === this.state.currentId) {
          messageFound = true
          unlinkedMessages.splice(i,1)
          delete lists[this.state.currentId]
          delete quickReplies[this.state.currentId]
          delete quickRepliesComponents[this.state.currentId]
          break
        }
      }
    }
    this.setState({
      currentId: linkedMessages[0].id,
      convoTitle: linkedMessages[0].title,
      linkedMessages,
      unlinkedMessages,
      lists,
      quickReplies,
      quickRepliesComponents
    })
  }

  addComponent (componentDetails, edit) {
    console.log('componentDetails', componentDetails)
    console.log('genericMessage props in addComponent', this.props)
    // this.showAddComponentModal()
    let component = this.getComponent(componentDetails)
    console.log('component retrieved', component)
    if (edit) {
      this.msg.info(`${componentDetails.componentName} component edited`)
    } else {
        this.msg.info(`New ${componentDetails.componentName} component added`)
    }
    this.updateList(component)
    component.handler()
    this.closeAddComponentModal()
  }

  updateList (component) {
    let lists = this.state.lists
    let componentIndex = lists[this.state.currentId].findIndex(item => item.content.props.id === component.component.props.id)
    if (componentIndex < 0) {
      console.log('adding new component', this.state.currentId)
      lists[this.state.currentId] = [...lists[this.state.currentId], {content: component.component}]
      this.setState({lists})
    } else {
      console.log('editing exisiting component')
      lists[this.state.currentId][componentIndex] = {content: component.component}
      this.setState({lists})
    }
  }

  openModal () {
    console.log('openModal this.state.editData', this.state.editData)
    console.log('{...this.state.editData}',{...this.state.editData})
    let modals = {
      'text': (<TextModal
        buttons={[]}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        noButtons={this.props.noButtons}
        pages={this.props.pages}
        buttonActions={this.props.buttonActions}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        hideUserOptions={this.props.hideUserOptions} />),
      'card': (<CardModal
        buttons={[]}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        pages={this.props.pages}
        buttonActions={this.props.buttonActions}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
      'image': (<ImageModal
        edit={this.state.editData ? true : false}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'file': (<FileModal
        edit={this.state.editData ? true : false}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'audio': (<AudioModal
        edit={this.state.editData ? true : false}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages} pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'media': (<MediaModal
        buttons={[]}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        buttonActions={this.props.buttonActions}
        noButtons={this.props.noButtons}
        pages={this.props.pages}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
      'video': (<LinkCarousel
        elementLimit={1}
        componentName={'YouTube video'}
        header={'YouTube video'}
        defaultErrorMsg={'Please enter a valid YouTube link'}
        invalidMsg={'Invalid YouTube link'}
        validMsg={'YouTube link is valid'}
        retrievingMsg={'Retrieving YouTube video metadata'}
        buttonTitle={'Watch on YouTube'}
        validateUrl={(url) => validateYoutubeURL(url)}
        buttons={[]}
        noButtons={this.props.noButtons}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        buttonActions={this.props.buttonActions}
        pages={this.props.pages}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
      'link': (<LinkCarousel
        buttons={[]}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        pages={this.props.pages}
        buttonActions={this.props.buttonActions}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
        'userInput': (<UserInputModal
          buttons={[]}
          customFields={this.state.customFields}
          module = {this.props.module}
          edit={this.state.editData ? true : false}
          {...this.state.editData}
          noButtons={this.props.noButtons}
          pages={this.props.pages}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage}
          pageId={this.props.pageId.pageId}
          showCloseModalAlertDialog={this.showCloseModalAlertDialog}
          closeModal={this.closeAddComponentModal}
          addComponent={this.addComponent}
          toggleGSModal={this.toggleGSModal}
          closeGSModal={this.closeGSModal}
          hideUserOptions={this.props.hideUserOptions} />)
    }
    return modals[this.state.componentType]
  }

  getComponent (broadcast) {
    console.log('getting component', broadcast)
    let componentId = broadcast.id || broadcast.id === 0 ? broadcast.id : new Date().getTime()
    console.log('componentId', componentId)
    let components = {
      'text': {
        component: (<Text
          videoId={broadcast.videoId}
          videoTitle={broadcast.videoTitle}
          videoDescription={broadcast.videoDescription}
          id={componentId}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          key={componentId}
          buttons={broadcast.buttons}
          message={broadcast.text}
          handleText={this.handleText}
          onRemove={this.removeComponent}
          removeState
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage}
          hideUserOptions={this.props.hideUserOptions} />),
        handler: () => {
          this.handleText({
            id: componentId,
            videoId: broadcast.videoId,
            componentName: broadcast.componentName,
            videoTitle: broadcast.videoTitle,
            videoDescription: broadcast.videoDescription,
            text: broadcast.text,
            buttons: broadcast.buttons ? broadcast.buttons : [],
            deletePayload: broadcast.deletePayload
          })
        }
      },
      // 'image': {
      //   component: (<Image
      //     id={componentId}
      //     editComponent={this.showAddComponentModal}
      //     pages={this.props.pages}
      //     file={broadcast.file}
      //     image={broadcast.fileurl}
      //     key={componentId}
      //     handleImage={this.handleImage}
      //     onRemove={this.removeComponent} />),
      //   handler: () => {
      //     this.handleImage({
      //       id: componentId,
      //       componentType: 'image',
      //       image_url: broadcast.image_url ? broadcast.image_url : '',
      //       fileurl: broadcast.fileurl ? broadcast.fileurl : '',
      //       file: broadcast.file
      //     })
      //   }
      // },
      'card': {
        component: (<Card
          id={componentId}
          elementLimit={broadcast.elementLimit}
          componentName={broadcast.componentName}
          header={broadcast.header}
          defaultErrorMsg={broadcast.defaultErrorMsg}
          invalidMsg={broadcast.invalidMsg}
          validMsg={broadcast.validMsg}
          retrievingMsg={broadcast.retrievingMsg}
          buttonTitle={broadcast.buttonTitle}
          validateUrl={broadcast.validateUrl}
          links={broadcast.links}
          fileurl={broadcast.fileurl}
          image_url={broadcast.image_url}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          handleCard={this.handleCard}
          fileName= {broadcast.fileName}
          type= {broadcast.type}
          size= {broadcast.size}
          buttons={broadcast.buttons}
          img={broadcast.image_url}
          title={broadcast.title}
          onRemove={this.removeComponent}
          singleCard
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage}
          cardDetails={broadcast}
          webviewurl={broadcast.webviewurl}
          elementUrl={broadcast.elementUrl}
          webviewsize={broadcast.webviewsize}
          default_action={broadcast.default_action} />),
        handler: () => {
          this.handleCard({
            id: componentId,
            componentName: broadcast.componentName,
            youtubeVideo: broadcast.youtubeVideo,
            links: broadcast.links,
            componentType: 'card',
            title: broadcast.title ? broadcast.title : '',
            description: broadcast.description ? broadcast.description : '',
            fileurl: broadcast.fileurl ? broadcast.fileurl : '',
            image_url: broadcast.image_url ? broadcast.image_url : '',
            fileName: broadcast.fileName ? broadcast.fileName : '',
            type: broadcast.type ? broadcast.type : '',
            size: broadcast.size ? broadcast.size : '',
            buttons: broadcast.buttons ? broadcast.buttons : [],
            webviewurl: broadcast.webviewurl,
            elementUrl: broadcast.elementUrl,
            webviewsize: broadcast.webviewsize,
            default_action: broadcast.default_action,
            deletePayload: broadcast.deletePayload
          })
        }
      },
      'gallery': {
        component: (<Gallery
          id={componentId}
          links={broadcast.links}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          cards={broadcast.cards}
          handleGallery={this.handleGallery}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleGallery({
            id: componentId,
            componentName: broadcast.componentName,
            links: broadcast.links,
            componentType: 'gallery',
            cards: broadcast.cards,
            deletePayload: broadcast.deletePayload
          })
        }
      },
      'audio': {
        component: (<Audio
          id={componentId}
          editComponent={this.showAddComponentModal}
          pages={this.props.pages}
          key={componentId}
          file={broadcast.file ? broadcast.file : {fileurl: broadcast.fileurl}}
          handleFile={this.handleFile}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleFile({
            id: componentId,
            componentName: broadcast.componentName,
            componentType: 'audio',
            file: broadcast.file ? broadcast.file : ''
          })
        }
      },
      'file': {
        component: (<File
          id={componentId}
          editComponent={this.showAddComponentModal}
          pages={this.props.pages}
          key={componentId}
          file={broadcast.file ? broadcast.file : {fileurl: broadcast.fileurl}}
          handleFile={this.handleFile}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleFile({id: componentId,
            componentType: 'file',
            componentName: broadcast.componentName,
            file: broadcast.file ? broadcast.file : ''
          })
        }
      },
      'image': {
        component: (<Media
          id={componentId}
          editComponent={this.showAddComponentModal}
          pages={this.props.pages}
          file={broadcast.file}
          image={broadcast.fileurl}
          media={broadcast}
          key={componentId}
          handleMedia={this.handleMedia}
          onRemove={this.removeComponent} />),
        handler: () => {
          this.handleImage({
            id: componentId,
            componentName: broadcast.componentName,
            componentType: 'image',
            image_url: broadcast.image_url ? broadcast.image_url : '',
            fileurl: broadcast.fileurl ? broadcast.fileurl : '',
            fileName: broadcast.fileName,
            file: broadcast.file
          })
        }
      },
      'video': {
        component: (<Media
          id={componentId}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          buttons={broadcast.buttons}
          youtubeLink={broadcast.youtubeLink && broadcast.youtubeLink}
          videoLink={broadcast.videoLink && broadcast.videoLink}
          media={broadcast}
          mediaType={broadcast.mediaType}
          handleMedia={this.handleMedia}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleMedia({id: componentId,
            youtubeLink: broadcast.youtubeLink && broadcast.youtubeLink,
            videoLink: broadcast.videoLink && broadcast.videoLink,
            componentType: 'video',
            componentName: broadcast.componentName,
            file: broadcast.file,
            fileurl: broadcast.fileurl,
            fileName: broadcast.fileName,
            image_url: broadcast.image_url,
            size: broadcast.size,
            type: broadcast.type,
            mediaType: broadcast.mediaType,
            buttons: broadcast.buttons ? broadcast.buttons : []})
        }
      },
      'media': {
        component: (<Media
          id={componentId}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          buttons={broadcast.buttons}
          youtubeLink={broadcast.youtubeLink && broadcast.youtubeLink}
          videoLink={broadcast.videoLink && broadcast.videoLink}
          media={broadcast}
          mediaType={broadcast.mediaType}
          handleMedia={this.handleMedia}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleMedia({id: componentId,
            youtubeLink: broadcast.youtubeLink && broadcast.youtubeLink,
            videoLink: broadcast.videoLink && broadcast.videoLink,
            componentType: 'media',
            componentName: broadcast.componentName,
            fileurl: broadcast.fileurl,
            fileName: broadcast.fileName,
            image_url: broadcast.image_url,
            size: broadcast.size,
            type: broadcast.type,
            mediaType: broadcast.mediaType,
            buttons: broadcast.buttons ? broadcast.buttons : []})
        }
      },
      'userInput': {
        component: (<UserInput
          id={componentId}
          editComponent={this.showAddComponentModal}
          pageId={this.state.pageId}
          key={componentId}
          action={broadcast.action}
          questions={broadcast.questions}
          onRemove={this.removeComponent}
          hideUserOptions={this.props.hideUserOptions} />),
        handler: () => {
          this.handleUserInput({
            id: componentId,
            componentType: 'userInput',
            componentName: broadcast.componentName,
            questions: broadcast.questions,
            action: broadcast.action
          })
        }
      }
    }
    return components[broadcast.componentType]
  }

  getQuickReplies (quickReplies) {
    return {
      content:
        <QuickReplies
          toggleGSModal={this.toggleGSModal}
          closeGSModal={this.closeGSModal}
          customFields={this.state.customFields}
          sequences={this.props.sequences}
          broadcasts={this.props.broadcasts}
          tags={this.props.tags}
          quickReplies={quickReplies}
          updateQuickReplies={this.updateQuickReplies}
        />
    }
  }

  getItems (id) {
    console.log('getItems', id)
    if (!this.state.lists[id]) {
      let lists = this.state.lists
      lists[id] = []
      this.setState({lists})
      return []
    } else {
      if (this.state.lists[id].length > 0) {
        if (!this.state.quickRepliesComponents[id]) {
          let quickRepliesComponents = this.state.quickRepliesComponents
          quickRepliesComponents[id] = {
            content:
              <QuickReplies
                toggleGSModal={this.toggleGSModal}
                closeGSModal={this.closeGSModal}
                customFields={this.state.customFields}
                sequences={this.props.sequences}
                broadcasts={this.props.broadcasts}
                tags={this.props.tags}
                quickReplies={this.state.quickReplies[id]}
                updateQuickReplies={this.updateQuickReplies}
                currentId={this.state.currentId}
              />
          }
          this.setState({quickRepliesComponents})
          console.log('returning getItems', this.state.lists[id].concat([quickRepliesComponents[id]]))
          return this.state.lists[id].concat([quickRepliesComponents[id]])
        } else {
          return this.state.lists[id].concat([this.state.quickRepliesComponents[id]])
        }
      } else {
        return this.state.lists[id]
      }
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('builders state', this.state)
    return (
    <div>

      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
      <div style={{float: 'left', clear: 'both'}}
        ref={(el) => { this.top = el }} />

        <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: '9999' }} className="modal fade" id="closeQuickReply" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0px, 100px)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                  <div style={{ display: 'block' }} className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Warning</h5>
                      <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  {
                      this.state.quickRepliesIndex === -1 ?
                      <div style={{ color: 'black' }} className="modal-body">
                          <p>Are you sure you want to close this quick reply and lose all the data that was entered?</p>
                          <button style={{ float: 'right', marginLeft: '10px' }}
                          className='btn btn-primary btn-sm'
                          id = 'closeQuickReplyYes'
                          data-dismiss='modal'>Yes
                          </button>
                          <button style={{ float: 'right' }}
                              className='btn btn-primary btn-sm'
                              data-dismiss='modal'>Cancel
                          </button>
                      </div> :
                          <div style={{ color: 'black' }} className="modal-body">
                          <p>Do you want to delete this quick reply?</p>
                          <button style={{ float: 'right', marginLeft: '10px' }}
                            className='btn btn-primary btn-sm'
                            id = 'deleteQuickReplyYes'
                            data-dismiss='modal'>Yes
                          </button>
                          <button style={{ float: 'right' }}
                            id = 'deleteQuickReplyNo'
                            className='btn btn-primary btn-sm'
                            data-dismiss='modal'>No
                          </button>
                      </div>
                  }
              </div>
          </div>
      </div>

      <a href='#/' style={{ display: 'none' }} ref='rename' data-toggle="modal" data-target="#rename">lossData</a>
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="rename" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Rename:
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <input style={{ maxWidth: '300px', float: 'left', margin: 2 }} ref={(c) => { this.titleConvo = c }} placeholder={this.state.convoTitle} type='text' className='form-control' />
              <button style={{ float: 'left', margin: 2 }} onClick={this.renameTitle} className='btn btn-primary' type='button' data-dismiss='modal'>Save</button>
            </div>
          </div>
        </div>
      </div>

      <CustomFields onLoadCustomFields={this.onLoadCustomFields} />

      <a href='#/' style={{ display: 'none' }} ref='ActionModal' data-toggle='modal' data-target='#ActionModal'>ActionModal</a>
      <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: 9999 }} className='modal fade' id='ActionModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div style={{ transform: 'translate(0, 0)'}} className='modal-dialog modal-lg' role='document'>
          {this.state.showGSModal && this.GSModalContent}
        </div>
      </div>

      <a href='#/' id='single' style={{ display: 'none' }} ref='singleModal' data-toggle="modal" data-target="#singleModal">singleModal</a>
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="singleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden='true'>
        <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className="modal-dialog modal-lg" role="document">
          {this.state.isShowingAddComponentModal && this.openModal()}
        </div>
      </div>

      <a href='#/' style={{ display: 'none' }} ref='lossData' data-toggle="modal" data-target="#lossData">lossData</a>
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="lossData" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Warning
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <p>Are you sure you want to close this modal and lose all the data that was entered?</p>
              <button style={{ float: 'right', marginLeft: '10px' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.closeModalAlertDialog()
                  this.closeAddComponentModal()
                }} data-dismiss='modal'>Yes
            </button>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.closeModalAlertDialog()
                }} data-dismiss='modal'>Cancel
            </button>
            </div>
          </div>
        </div>
      </div>

      <a href='#/' style={{ display: 'none' }} ref='resetModal' data-toggle="modal" data-target="#resetModal">lossData</a>
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Warning
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <p>Are you sure you want to reset the message ?</p>
              <button style={{ float: 'right', marginLeft: '10px' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.newConvo()
                }} data-dismiss='modal'>Yes
            </button>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.closeResetAlertDialog()
                }} data-dismiss='modal'>Cancel
            </button>
            </div>
          </div>
        </div>
      </div>

      {
        this.props.builderValue === 'basic'
        ? <BASICBUILDER
          linkedMessages={this.state.linkedMessages}
          unlinkedMessages={this.state.unlinkedMessages}
          currentId={this.state.currentId}
          changeMessage={this.changeMessage}
          convoTitle={this.state.convoTitle}
          pageId={this.props.pageId}
          handleTargetValue={this.props.handleTargetValue}
          subscriberCount={this.props.subscriberCount}
          totalSubscribersCount={this.props.totalSubscribersCount}
          resetTarget={this.props.resetTarget}
          showDialog={this.showDialog}
          hiddenComponents={this.state.hiddenComponents}
          showAddComponentModal={this.showAddComponentModal}
          module={this.props.module}
          noDefaultHeight={this.props.noDefaultHeight}
          getItems={this.getItems}
          list={this.state.lists[this.state.currentId]}
          titleEditable={this.props.titleEditable}
          showTabs={this.props.showTabs}
          removeMessage={this.removeMessage}
        />
        : this.props.builderValue === 'flow' &&
        <FLOWBUILDER
          currentId={this.state.currentId}
          rerenderFlowBuilder={this.props.rerenderFlowBuilder}
          showAddComponentModal={this.showAddComponentModal}
          linkedMessages={this.state.linkedMessages}
          unlinkedMessages={this.state.unlinkedMessages}
          handleTargetValue={this.props.handleTargetValue}
          subscriberCount={this.props.subscriberCount}
          totalSubscribersCount={this.props.totalSubscribersCount}
          resetTarget={this.props.resetTarget}
          getComponent={this.getComponent}
          pageId={this.props.pageId}
          getItems={this.getItems}
          changeMessage={this.changeMessage}
          removeMessage={this.removeMessage}
          reset={this.props.reset}
          onNext={this.props.onNext}
          isBroadcastInvalid={this.props.isBroadcastInvalid}
        />
      }

    </div>
    )
  }
}

Builders.propTypes = {
  'convoTitle': PropTypes.string,
  'handleChange': PropTypes.func.isRequired,
  'setReset': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array,
  'titleEditable': PropTypes.bool,
  'broadcast': PropTypes.array,
  'module': PropTypes.string,
  'pages': PropTypes.array,
  'replyWithMessage': PropTypes.func,
  'pageId': PropTypes.object.isRequired,
  'buttonActions': PropTypes.array.isRequired,
  'hideUserOptions': PropTypes.bool,
  'componentLimit': PropTypes.number,
  'builderValue': PropTypes.string.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'totalSubscribersCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.bool.isRequired,
  'noDefaultHeight': PropTypes.bool,
  'linkedMessages': PropTypes.array,
  'showTabs': PropTypes.bool.isRequired,
  'unlinkedMessages': PropTypes.array,
  'switchBuilder': PropTypes.func.isRequired,
  'reset': PropTypes.func.isRequired,
  'onNext': PropTypes.func.isRequired,
  'isBroadcastInvalid': PropTypes.func.isRequired
}

Builders.defaultProps = {
  'convoTitle': 'Title',
  'hiddenComponents': [],
  'titleEditable': false,
  'broadcast': []
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: state.sequenceInfo.sequences,
    broadcasts: state.templatesInfo.broadcasts,
    tags: state.tagsInfo.tags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      fetchAllSequence: fetchAllSequence,
      loadBroadcastsList: loadBroadcastsList,
      loadTags: loadTags
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Builders)
