import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import PropTypes from 'prop-types'

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
import YoutubeVideoModal from '../YoutubeVideoModal'

class Builders extends React.Component {
  constructor (props, context) {
    super(props, context)
    let hiddenComponents = this.props.hiddenComponents.map(component => component.toLowerCase())
    let currentId = new Date().getTime()
    this.state = {
      list: [],
      quickReplies: [],
      broadcast: this.props.broadcast.slice(),
      isShowingModal: false,
      convoTitle: this.props.convoTitle,
      pageId: this.props.pageId.pageId,
      hiddenComponents: hiddenComponents,
      componentType: '',
      linkedMessages: this.props.linkedMessages ? this.props.linkedMessages : [{title: this.props.convoTitle, id: currentId, messageContent: []}],
      unlinkedMessages: this.props.unlinkedMessages ? this.props.unlinkedMessages : [],
      currentId
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

    if (props.setReset) {
      props.setReset(this.reset)
    }

    this.props.loadBroadcastsList()
    this.props.loadTags()
    this.props.fetchAllSequence()
    console.log('genericMessage props in constructor', this.props)
  }

  changeMessage (id) {
    let messages = this.state.linkedMessages.concat(this.state.unlinkedMessages)
    let messageIndex = messages.findIndex(m => m.id === id)
    if (messageIndex > -1) {
      console.log('changing message', this.state.linkedMessages[messageIndex])
      this.setState({currentId: id}, () => {
        let filteredData = this.state.linkedMessages.concat(this.state.unlinkedMessages).filter((lm) => lm.id === id)
        let list = filteredData.length > 0 ? filteredData[0].messageContent : []
        this.initializeList(list)
        this.handleChange({broadcast: messages[messageIndex].messageContent, convoTitle: messages[messageIndex].title})
      })
    }
  }

  updateLinkedMessagesPayload (broadcast) {
    let linkedMessages = this.state.linkedMessages
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === this.state.currentId) {
        linkedMessages[i].messageContent = broadcast
      }
    }
    this.setState({linkedMessages})
  }

  editLinkedMessage (button) {
    let linkedMessages = this.state.linkedMessages
    let buttonPayload = JSON.parse(button.payload)
    for (let i = linkedMessages.length-1 ; i >= 0; i--) {
      if (linkedMessages[i].id === buttonPayload.blockUniqueId) {
        // linkedMessages[i].title = button.title
        linkedMessages[i].linkedButton = button
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
    this.setState({linkedMessages})
  }

  handleChange (broadcast, event) {
    console.log('handleChange broadcast in basicBuilder', broadcast)
    console.log('handleChange event in basciBuilder', event)
    if (broadcast.convoTitle) {
      this.updateLinkedMessagesTitle(broadcast.convoTitle)
      this.props.handleChange({convoTitle: broadcast.convoTitle, linkedMessages: this.state.linkedMessages})
    } else {
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
          this.createLinkedMessagesFromButtons(broadcastComponent.buttons)
        }
        if (broadcastComponent.cards) {
          for (let j = 0; j < broadcastComponent.cards.length; j++) {
            let card = broadcastComponent.cards[j]
            this.createLinkedMessagesFromButtons(card.buttons)
          }
        }
      }
      this.props.handleChange({broadcast: broadcast, linkedMessages: this.state.linkedMessages, unlinkedMessages: this.state.unlinkedMessages})
    }
  }

  createLinkedMessagesFromButtons(buttons) {
    for (let j = 0; j < buttons.length; j++) {
      let button = buttons[j]
      if (button.type === 'postback' && button.payload === null) {
        console.log('found create new message button')
        this.addLinkedMessage(button)
      } else {
        this.editLinkedMessage(button)
      }
    }
  }

  removeLinkedMessages (deletePayload) {
    let linkedMessages = this.state.linkedMessages
    let unlinkedMessages = this.state.unlinkedMessages
    deletePayload = deletePayload.map(payload => {
      return JSON.parse(payload).blockUniqueId
    })
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
          unlinkedMessages = unlinkedMessages.concat(linkedMessages.splice(j, 1))
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
    linkedMessages.push(data)
    this.setState({linkedMessages})
  }

  updateQuickReplies (quickReplies) {
    console.log('updateQuickReplies', quickReplies)
    let broadcast = this.appendQuickRepliesToEnd(this.state.broadcast, quickReplies)
    console.log('broadcast after updating quick replies', broadcast)
    this.setState({quickReplies, broadcast})
    this.handleChange({broadcast})
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

  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   if (this.props.convoTitle !== nextProps.convoTitle) {
  //     this.setState({convoTitle: nextProps.convoTitle})
  //   }
  //   if (this.props.broadcast !== nextProps.broadcast) {
  //     this.initializeList(this.props.linkedMessages.concat(this.props.unlinkedMessages).filter((lm) => lm.id === this.state.currentId)[0].messageContent)
  //   }
  // }

  initializeList (broadcast) {
    console.log('initializeList', broadcast)
    let temp = []
    for (var i = 0; i < broadcast.length; i++) {
      let component = this.getComponent(broadcast[i]).component
      temp.push({content: component})
    }
    this.setState({list: temp, broadcast})
    this.handleChange({broadcast})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  reset (showDialog = true) {
    if (showDialog) {
      this.showResetAlertDialog()
    } else {
      this.newConvo()
    }
  }

  showResetAlertDialog () {
    if (this.state.broadcast.length > 0 || this.state.list.length > 0) {
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
    if (!editData && this.props.componentLimit && this.state.list.length === this.props.componentLimit) {
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
    this.handleChange({convoTitle: this.titleConvo.value})
  }

  handleText (obj) {
    console.log('handleText', obj)
    var temp = this.state.broadcast
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
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.buttons})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }
    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    console.log('handleText temp', temp)
    console.log('handleText state', this.state)
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
    var temp = this.state.broadcast
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

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
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
    var temp = this.state.broadcast
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

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleGallery (obj) {
    console.log('handleGallery', obj)
    var temp = this.state.broadcast
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

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleImage (obj) {
    var temp = this.state.broadcast
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

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  handleFile (obj) {
    var temp = this.state.broadcast
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

    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  removeComponent (obj) {
    console.log('obj in removeComponent', obj)
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    console.log('temp', temp)
    console.log('temp2', temp2)
    if (temp2.length === 0) {
      this.setState({quickReplies: []})
    }
    this.setState({list: temp, broadcast: temp2})
    this.handleChange({broadcast: temp2}, obj)
  }

  newConvo () {
    this.setState({broadcast: [], list: [], convoTitle: this.defaultTitle, quickReplies: []})
    this.handleChange({broadcast: []})
  }

  addComponent (componentDetails, edit) {
    console.log('componentDetails', componentDetails)
    console.log('genericMessage props in addComponent', this.props)
    // this.showAddComponentModal()
    let component = this.getComponent(componentDetails)
    console.log('component retrieved', component)
    if (edit) {
      if (componentDetails.componentType === 'text' && componentDetails.videoId) {
        this.msg.info(`youtube video component edited`)
      } else {
        this.msg.info(`${componentDetails.componentType} component edited`)
      }
    } else {
      if (componentDetails.componentType === 'text' && componentDetails.videoId) {
        this.msg.info(`New youtube video component added`)
      } else {
        this.msg.info(`New ${componentDetails.componentType} component added`)
      }
    }
    this.updateList(component)
    component.handler()
    this.closeAddComponentModal()
  }

  updateList (component) {
    let temp = this.state.list
    let componentIndex = this.state.list.findIndex(item => item.content.props.id === component.component.props.id)
    if (componentIndex < 0) {
      console.log('adding new component')
      console.log({list: [...temp, {content: component.component}]})
      this.setState({list: [...temp, {content: component.component}]})
    } else {
      console.log('editing exisiting component')
      temp[componentIndex] = {content: component.component}
      this.setState({list: temp})
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
        addComponent={this.addComponent} />),
      'video': (<YoutubeVideoModal
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
        addComponent={this.addComponent} />)
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
          file={broadcast.file ? broadcast.file : null}
          handleFile={this.handleFile}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleFile({
            id: componentId,
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
          file={broadcast.file ? broadcast.file : null}
          handleFile={this.handleFile}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleFile({id: componentId,
            componentType: 'file',
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
            fileurl: broadcast.fileurl,
            fileName: broadcast.fileName,
            image_url: broadcast.image_url,
            size: broadcast.size,
            type: broadcast.type,
            mediaType: broadcast.mediaType,
            buttons: broadcast.buttons ? broadcast.buttons : []})
        }
      }
    }
    return components[broadcast.componentType]
  }

  getQuickReplies () {
    return {
      content:
        <QuickReplies
          sequences={this.props.sequences}
          broadcasts={this.props.broadcasts}
          tags={this.props.tags}
          quickReplies={this.state.quickReplies}
          updateQuickReplies={this.updateQuickReplies}
        />
    }
  }

  getItems () {
    if (this.state.list.length > 0) {
      return this.state.list.concat([{
        content:
          <QuickReplies
            sequences={this.props.sequences}
            broadcasts={this.props.broadcasts}
            tags={this.props.tags}
            quickReplies={this.state.quickReplies}
            updateQuickReplies={this.updateQuickReplies}
          />
      }])
    } else {
      return this.state.list
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

    return (
    <div>

      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
      <div style={{float: 'left', clear: 'both'}}
        ref={(el) => { this.top = el }} />

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
                  this.closeResetAlertDialog()
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
          resetTarget={this.props.resetTarget}
          showDialog={this.showDialog}
          hiddenComponents={this.state.hiddenComponents}
          showAddComponentModal={this.showAddComponentModal}
          list={this.state.list}
          module={this.props.module}
          noDefaultHeight={this.props.noDefaultHeight}
          getItems={this.getItems}
          titleEditable={this.props.titleEditable}
          showTabs={this.props.showTabs}
        />
        : this.props.builderValue === 'flow' &&
        <FLOWBUILDER
          showAddComponentModal={this.showAddComponentModal}
          linkedMessages={this.state.linkedMessages}
          unlinkedMessages={this.state.unlinkedMessages}
          getQuickReplies={this.getQuickReplies}
          getComponent={this.getComponent}
          handleTargetValue={this.props.handleTargetValue}
          subscriberCount={this.props.subscriberCount}
          resetTarget={this.props.resetTarget}
          pageId={this.props.pageId}
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
  'location': PropTypes.object.isRequired,
  'locationPages': PropTypes.object.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.bool.isRequired,
  'noDefaultHeight': PropTypes.bool,
  'linkedMessages': PropTypes.array,
  'showTabs': PropTypes.bool.isRequired,
  'unlinkedMessages': PropTypes.array
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
    sequences: state.sequenceInfo.sequences ? state.sequenceInfo.sequences : [],
    broadcasts: state.templatesInfo.broadcasts ? state.templatesInfo.broadcasts : [],
    tags: state.tagsInfo.tags ? state.tagsInfo.tags : []
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
