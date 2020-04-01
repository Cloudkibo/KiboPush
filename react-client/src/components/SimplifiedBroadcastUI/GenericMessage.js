import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { deleteFiles, deleteFile } from '../../utility/utils'

import { loadTags } from '../../redux/actions/tags.actions'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { loadCustomFields } from '../../redux/actions/customFields.actions'

// import Image from './PreviewComponents/Image'
import Audio from './PreviewComponents/Audio'
import File from './PreviewComponents/File'
import Text from './PreviewComponents/Text'
import Card from './PreviewComponents/Card'
import Gallery from './PreviewComponents/Gallery'
import Media from './PreviewComponents/Media'
import AlertContainer from 'react-alert'
import DragSortableList from 'react-drag-sortable'
import GenericMessageComponents from './GenericMessageComponents'
import PropTypes from 'prop-types'
import TextModal from './TextModal'
import CardModal from './CardModal'
import ImageModal from './ImageModal'
import FileModal from './FileModal'
import AudioModal from './AudioModal'
import MediaModal from './MediaModal'
import LinkCarousel from './LinkCarousel';
import QuickReplies from './QuickReplies'
import YoutubeVideoModal from './YoutubeVideoModal'

class GenericMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    let hiddenComponents = this.props.hiddenComponents.map(component => component.toLowerCase())
    this.state = {
      list: [],
      quickReplies: this.props.broadcast && this.props.broadcast.length > 0 ? this.props.broadcast[this.props.broadcast.length-1].quickReplies : [],
      broadcast: this.props.broadcast.slice(),
      isShowingModal: false,
      convoTitle: this.props.convoTitle,
      pageId: this.props.pageId,
      hiddenComponents: hiddenComponents,
      componentType: '',
      showGSModal: false,
      quickRepliesComponent: null,
      tempFiles: [],
      newFiles: []
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
    this.toggleGSModal = this.toggleGSModal.bind(this)
    this.closeGSModal = this.closeGSModal.bind(this)
    this.setTempFiles = this.setTempFiles.bind(this)
    this.setNewFiles = this.setNewFiles.bind(this)
    this.GSModalContent = null

    if (props.setReset) {
      props.setReset(this.reset)
    }
    this.props.loadCustomFields()
    this.props.loadTags()
    this.props.fetchAllSequence()
    console.log('genericMessage props in constructor', this.props)
  }


  setTempFiles (files) {
    let tempFiles = this.state.tempFiles
    tempFiles = tempFiles.concat(files)
    this.setState({tempFiles})
  }

  setNewFiles (files) {
    let newFiles = this.state.newFiles
    newFiles = newFiles.concat(files)
    this.props.handleChange({newFiles})
    this.setState({newFiles})
  }

  toggleGSModal (value, content) {
    console.log('show toggleGSModal called in genericMessage')
    this.setState({showGSModal: value})
    this.GSModalContent = content
  }

  updateQuickReplies (quickReplies) {
    return new Promise((resolve, reject) => {
      console.log('updateQuickReplies', quickReplies)
      let broadcast = this.appendQuickRepliesToEnd(this.state.broadcast, quickReplies)
      console.log('broadcast after updating quick replies', broadcast)
      this.setState({quickReplies, broadcast}, () => {
        resolve()
      })
      this.props.handleChange({broadcast})
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
    console.log('genericMessage props in componentDidMount', this.props)
    if (this.state.broadcast && this.state.broadcast.length > 0) {
      this.initializeList(this.state.broadcast)
    }
    console.log('genericMessage props in end of componentDidMount', this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.convoTitle !== nextProps.convoTitle) {
      this.setState({convoTitle: nextProps.convoTitle})
    }
    if (this.props.broadcast !== nextProps.broadcast) {
      if (nextProps.broadcast.length > 0) {
        this.setState({quickReplies: nextProps.broadcast[nextProps.broadcast.length-1].quickReplies})
      }
      this.initializeList(nextProps.broadcast)
    }
    if (!this.props.sequences && nextProps.sequences) {
      this.setState({quickRepliesComponent: null})
    }
    if (!this.props.tags && nextProps.tags) {
      this.setState({quickRepliesComponent: null})
    }
    if (!this.props.customFields && nextProps.customFields) {
      this.setState({quickRepliesComponent: null})
    }
    if (nextProps.newFiles && this.state.newFiles.length !== nextProps.newFiles.length) {
      this.setState({newFiles: nextProps.newFiles})
    }
  }

  initializeList (broadcast) {
    console.log('initializeList', broadcast)
    let temp = []
    for (var i = 0; i < broadcast.length; i++) {
      let component = this.getComponent(broadcast[i]).component
      temp.push({content: component})
    }
    this.setState({list: temp, broadcast})
    this.props.handleChange({broadcast})
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
      if (this.state.tempFiles.length > 0 && this.state.componentType !== componentType) {
        console.log('deleting file', this.state.currentFile)
        for (let i = 0; i < this.state.tempFiles.length; i++) {
          deleteFile(this.state.tempFiles[i])
        }
      }
      this.setState({isShowingAddComponentModal: true, componentType, editData, tempFiles: []})
      this.refs.singleModal.click()
      // $(document).on('hide.bs.modal','#singleModal', function () {
      //   alert('hi');
      // })
    }
  }

  closeAddComponentModal (saving) {
    if (!saving && this.state.tempFiles.length > 0) {
      console.log('deleting file', this.state.tempFiles)
      for (let i = 0; i < this.state.tempFiles.length; i++) {
        deleteFile(this.state.tempFiles[i])
      }
    } else if (saving) {
      this.setNewFiles(this.state.tempFiles)
    }
    this.setState({isShowingAddComponentModal: false, editData: null, tempFiles: []})
    this.refs.singleModal.click()
  }

  closeGSModal () {
    this.setState({showGSModal: false})
    this.refs.ActionModal.click()
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
    this.props.handleChange({convoTitle: this.titleConvo.value})
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
        temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text', buttons: obj.buttons})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text'})
      }
    }
    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    console.log('handleText temp', temp)
    console.log('handleText state', this.state)
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
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
        temp[a].componentName = obj.componentName
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
    this.props.handleChange({broadcast: temp}, obj)
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
        temp[a].componentName = obj.componentName
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
    this.props.handleChange({broadcast: temp}, obj)
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
    this.props.handleChange({broadcast: temp}, obj)
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
    this.props.handleChange({broadcast: temp}, obj)
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
    this.props.handleChange({broadcast: temp}, obj)
  }

  removeComponent (obj) {
    console.log('obj in removeComponent', obj)
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    let component = this.state.broadcast.find((component) => { return (component.id === obj.id) })
    let newFiles = deleteFiles([component], this.state.newFiles)
    console.log('temp', temp)
    console.log('temp2', temp2)
    if (temp2.length === 0) {
      this.setState({quickReplies: []})
    }
    this.setState({list: temp, broadcast: temp2, newFiles})
    this.props.handleChange({broadcast: temp2, newFiles}, obj)
  }

  newConvo () {
    this.setState({broadcast: [], list: [], convoTitle: this.defaultTitle, quickReplies: []})
    this.props.handleChange({broadcast: []})
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
    this.closeAddComponentModal(true)
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
        pageId={this.props.pageId}
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
        pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
      'image': (<ImageModal
        edit={this.state.editData ? true : false}
        setTempFiles={this.setTempFiles}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages}
        pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'file': (<FileModal
        edit={this.state.editData ? true : false}
        setTempFiles={this.setTempFiles}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages}
        pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'audio': (<AudioModal
        edit={this.state.editData ? true : false}
        setTempFiles={this.setTempFiles}
        module = {this.props.module}
        {...this.state.editData}
        replyWithMessage={this.props.replyWithMessage}
        pages={this.props.pages} pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        addComponent={this.addComponent} />),
      'media': (<MediaModal
        buttons={[]}
        setTempFiles={this.setTempFiles}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        buttonActions={this.props.buttonActions}
        noButtons={this.props.noButtons}
        pages={this.props.pages}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
        addComponent={this.addComponent} />),
      'video': (<YoutubeVideoModal
        buttons={[]}
        setTempFiles={this.setTempFiles}
        noButtons={this.props.noButtons}
        module = {this.props.module}
        edit={this.state.editData ? true : false}
        {...this.state.editData}
        buttonActions={this.props.buttonActions}
        pages={this.props.pages}
        replyWithMessage={this.props.replyWithMessage}
        pageId={this.props.pageId}
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
        pageId={this.props.pageId}
        showCloseModalAlertDialog={this.showCloseModalAlertDialog}
        closeModal={this.closeAddComponentModal}
        toggleGSModal={this.toggleGSModal}
        closeGSModal={this.closeGSModal}
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
          card={broadcast.card}
          youtubeLink={broadcast.youtubeLink}
          fileSizeExceeded={broadcast.fileSizeExceeded}
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
            youtubeVideo: broadcast.youtubeVideo,
            elementLimit: broadcast.elementLimit,
            header: broadcast.header,
            defaultErrorMsg: broadcast.defaultErrorMsg,
            invalidMsg: broadcast.invalidMsg,
            validMsg: broadcast.validMsg, 
            retrievingMsg: broadcast.retrievingMsg,
            buttonTitle: broadcast.buttonTitle,
            validateUrl: broadcast.validateUrl,
            links: broadcast.links,
            componentType: 'card',
            componentName:  broadcast.componentName ? broadcast.componentName: 'card',
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
            componentName: broadcast.componentName ? broadcast.componentName: 'gallery',
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
            componentName: 'audio',
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
            componentName: 'file',
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
            componentName: 'image',
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
            componentName: 'video',
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
            componentName: 'media',
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

  getItems () {
    if (this.state.list.length > 0) {
      console.log('quick reply', this.state.list[this.state.list.length - 1])
      if (!this.state.quickRepliesComponent) {
        this.setState({quickRepliesComponent: {
          content:
            (<QuickReplies
              toggleGSModal={this.toggleGSModal}
              closeGSModal={this.closeGSModal}
              customFields={this.props.customFields}
              sequences={this.props.sequences}
              tags={this.props.tags}
              quickReplies={this.state.quickReplies}
              updateQuickReplies={this.updateQuickReplies}
              currentId={this.state.currentId}
            />)
        }})
      } else {
        return this.state.list.concat([this.state.quickRepliesComponent])
      }
    } else {
      return this.state.list
    }
  }


  componentWillUnmount () {
    if (this.state.tempFiles.length > 0) {
      for (let i = 0; i < this.state.tempFiles.length; i++) {
        deleteFile(this.state.tempFiles[i])
      }
    }
    if (this.state.newFiles.length > 0) {
      for (let i = 0; i < this.state.newFiles.length; i++) {
        deleteFile(this.state.newFiles[i])
      }
    }
  }

  render () {
    console.log('render in genericMessage')
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
    <div className='m-grid__item m-grid__item--fluid m-wrapper'>

      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
      <div style={{float: 'left', clear: 'both'}}
        ref={(el) => { this.top = el }} />
      <div className='m-content'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <div className='row'>
              <div className='col-12'>
                <div className='row'>
                  <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                    {this.props.module && this.props.module === 'sponsorMessaging'
                      ? <div></div>
                      :<div style={{marginBottom: '30px', border: '1px solid #ccc', borderRadius: '0px', zIndex: 1}} className='ui-block'>
                        <div style={{padding: '5px'}}>
                          {!this.props.titleEditable
                                ? <h3> {this.state.convoTitle} </h3>
                                : <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                              }
                        </div>
                      </div>
                    }
                    <GenericMessageComponents hiddenComponents={this.state.hiddenComponents} addComponent={this.showAddComponentModal} addedComponents={this.state.list.length} module= {this.props.module} componentLimit = {this.props.componentLimit}/>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
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
                                this.closeAddComponentModal(false)
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
                    <div className='iphone-x' style={{height: !this.props.noDefaultHeight ? 90 + 'vh' : null, marginTop: '15px', paddingRight: '10%', paddingLeft: '10%', paddingTop: 100}}>
                      {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                      <DragSortableList style={{overflowY: 'scroll', height: '75vh'}} items={this.getItems()} dropBackTransitionDuration={0.3} type='vertical' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

GenericMessage.propTypes = {
  'convoTitle': PropTypes.string,
  'handleChange': PropTypes.func.isRequired,
  'setReset': PropTypes.func,
  'hiddenComponents': PropTypes.array,
  'titleEditable': PropTypes.bool,
  'broadcast': PropTypes.array,
  'module': PropTypes.string,
  'pages': PropTypes.array,
  'replyWithMessage': PropTypes.func,
  'pageId': PropTypes.string,
  'buttonActions': PropTypes.array.isRequired,
  'hideUserOptions': PropTypes.bool,
  'componentLimit': PropTypes.number
}

GenericMessage.defaultProps = {
  'convoTitle': 'Title',
  'hiddenComponents': [],
  'titleEditable': false,
  'broadcast': [],
  'componentLimit': 3
}

function mapStateToProps (state) {
  console.log(state)
  return {
    customFields: (state.customFieldInfo.customFields),
    sequences: state.sequenceInfo.sequences,
    tags: state.tagsInfo.tags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      loadCustomFields,
      fetchAllSequence,
      loadTags
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GenericMessage)
