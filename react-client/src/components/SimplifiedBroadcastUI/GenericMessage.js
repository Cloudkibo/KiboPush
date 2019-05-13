import React from 'react'
import Image from './PreviewComponents/Image'
import List from './PreviewComponents/List'
import Video from './PreviewComponents/Video'
import Audio from './PreviewComponents/Audio'
import File from './PreviewComponents/File'
import Text from './PreviewComponents/Text'
import Card from './PreviewComponents/Card'
import Media from './PreviewComponents/Media'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import DragSortableList from 'react-drag-sortable'
import GenericMessageComponents from './GenericMessageComponents'
import PropTypes from 'prop-types'
import TextModal from './TextModal'
import CardModal from './CardModal'
import ListModal from './ListModal'
import ImageModal from './ImageModal'
import FileModal from './FileModal'
import AudioModal from './AudioModal'
import MediaModal from './MediaModal'
import YoutubeVideoModal from './YoutubeVideoModal'

class GenericMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    let hiddenComponents = this.props.hiddenComponents.map(component => component.toLowerCase())
    this.state = {
      list: [],
      broadcast: this.props.broadcast.slice(),
      isShowingModal: false,
      convoTitle: this.props.convoTitle,
      pageId: this.props.pageId,
      hiddenComponents: hiddenComponents,
      componentType: ''
    }
    this.reset = this.reset.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.handleMedia = this.handleMedia.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleList = this.handleList.bind(this)
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
    if (props.setReset) {
      props.setReset(this.reset)
    }

    console.log('genericMessage props in constructor', this.props)
  }

  componentDidMount () {
    console.log('genericMessage props in componentDidMount', this.props)
    if (this.state.broadcast && this.state.broadcast.length > 0) {
      this.initializeList(this.state.broadcast)
    }
    console.log('genericMessage props in end of componentDidMount', this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.convoTitle !== nextProps.convoTitle) {
      this.setState({convoTitle: nextProps.convoTitle})
    }
    if (this.props.broadcast !== nextProps.broadcast) {
      this.initializeList(nextProps.broadcast)
    }
  }

  initializeList (broadcast) {
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
    }
  }

  closeResetAlertDialog () {
    this.setState({isShowingModalResetAlert: false})
  }

  showAddComponentModal (componentType) {
    this.setState({isShowingAddComponentModal: true, componentType})
  }

  closeAddComponentModal () {
    this.setState({isShowingAddComponentModal: false})
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    console.log('in renameTitle')
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
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.buttons.length > 0) {
          temp[i].buttons = obj.buttons
        } else {
          delete temp[i].buttons
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.buttons.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.buttons})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
  }

  handleCard (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        console.log('enter in function')
        temp[i].fileName = obj.fileName
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        temp[i].webviewsize = obj.webviewsize
        temp[i].webviewurl = obj.webviewurl
        temp[i].elementUrl = obj.elementUrl
        if (obj.default_action && obj.default_action !== '') {
          temp[i].default_action = obj.default_action
        } else if (temp[i].default_action) {
          console.log('delete default action')
          delete temp[i].default_action
        }
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
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
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].mediaType = obj.mediaType
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    if (obj.cards) {
      obj.cards.forEach((d) => {
        delete d.id
      })
    }
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp}, obj)
  }
  handleList (obj) {
    console.log('in create convo handleList', obj)
    var temp = this.state.broadcast
    var isPresent = false
    // if (obj.listItems) {
    //   obj.listItems.forEach((d) => {
    //     delete d.id
    //   })
    // }
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].listItems = obj.listItems
        temp[i].topElementStyle = obj.topElementStyle
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
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
    console.log('temp', temp)
    console.log('temp2', temp2)
    this.setState({list: temp, broadcast: temp2})
    this.props.handleChange({broadcast: temp2}, obj)
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
    this.props.handleChange({broadcast: []})
  }

  addComponent (componentDetails) {
    console.log('componentDetails', componentDetails)
    console.log('genericMessage props in addComponent', this.props)
    // this.showAddComponentModal()
    let component = this.getComponent(componentDetails)
    console.log('component retrieved', component)
    this.msg.info(`New ${componentDetails.componentType} component added`)
    this.updateList(component)
    component.handler()
    this.closeAddComponentModal()
  }

  updateList (component) {
    let temp = this.state.list
    let componentIndex = this.state.list.findIndex(item => item.content.props.id === component.component.props.id)
    if (componentIndex < 0) {
      console.log('adding new component')
      this.setState({list: [...temp, {content: component.component}]})
    } else {
      console.log('editing exisiting component')
      temp[componentIndex] = {content: component.component}
      this.setState({list: temp})
    }
  }

  openModal () {
    let modals = {
      'text': (<TextModal buttons={[]} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} hideUserOptions={this.props.hideUserOptions} />),
      'card': (<CardModal buttons={[]} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'list': (<ListModal buttons={[]} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'image': (<ImageModal replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'file': (<FileModal replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'audio': (<AudioModal replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'media': (<MediaModal buttons={[]} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />),
      'video': (<YoutubeVideoModal buttons={[]} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeAddComponentModal} addComponent={this.addComponent} />)
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
          id={componentId}
          addComponent={this.addComponent}
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
            text: broadcast.text,
            buttons: broadcast.buttons ? broadcast.buttons : []
          })
        }
      },
      'image': {
        component: (<Image
          id={componentId}
          addComponent={this.addComponent}
          pages={this.props.pages}
          file={broadcast.file}
          image={broadcast.fileurl}
          key={componentId}
          handleImage={this.handleImage}
          onRemove={this.removeComponent} />),
        handler: () => {
          this.handleImage({
            id: componentId,
            componentType: 'image',
            image_url: broadcast.image_url ? broadcast.image_url : '',
            fileurl: broadcast.fileurl ? broadcast.fileurl : '',
            file: broadcast.file
          })
        }
      },
      'card': {
        component: (<Card
          id={componentId}
          addComponent={this.addComponent}
          file={broadcast.file}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          handleCard={this.handleCard}
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
            componentType: 'card',
            title: broadcast.title ? broadcast.title : '',
            description: broadcast.description ? broadcast.description : '',
            fileurl: broadcast.fileurl ? broadcast.fileurl : '',
            image_url: broadcast.image_url ? broadcast.image_url : '',
            buttons: broadcast.buttons ? broadcast.buttons : [],
            webviewurl: broadcast.webviewurl,
            elementUrl: broadcast.elementUrl,
            webviewsize: broadcast.webviewsize,
            default_action: broadcast.default_action
          })
        }
      },
      'audio': {
        component: (<Audio
          id={componentId}
          addComponent={this.addComponent}
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
      'video': {
        component: (<Video
          id={componentId}
          addComponent={this.addComponent}
          pages={this.props.pages}
          key={componentId}
          file={broadcast.fileurl ? broadcast : null}
          handleFile={this.handleFile}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleFile({
            id: componentId,
            componentType: 'video',
            fileurl: broadcast.fileurl ? broadcast.fileurl : ''
          })
        }
      },
      'file': {
        component: (<File
          id={componentId}
          addComponent={this.addComponent}
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
      'list': {
        component: (<List
          id={componentId}
          addComponent={this.addComponent}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          list={broadcast}
          listItems={broadcast.listItems}
          handleList={this.handleList}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage}
          default_action={broadcast.default_action} />),
        handler: () => {
          this.handleList({
            id: componentId,
            listItems: broadcast.listItems ? broadcast.listItems : [],
            componentType: 'list',
            topElementStyle: broadcast.topElementStyle ? broadcast.topElementStyle : 'compact',
            buttons: broadcast.buttons ? broadcast.buttons : [],
            default_action={broadcast.default_action}
          })
        }
      },
      'media': {
        component: (<Media
          id={componentId}
          addComponent={this.addComponent}
          pageId={this.state.pageId}
          pages={this.props.pages}
          key={componentId}
          buttons={broadcast.buttons}
          media={broadcast}
          mediaType={broadcast.mediaType}
          handleMedia={this.handleMedia}
          onRemove={this.removeComponent}
          buttonActions={this.props.buttonActions}
          replyWithMessage={this.props.replyWithMessage} />),
        handler: () => {
          this.handleMedia({id: componentId,
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

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (<div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                    <StickyDiv zIndex={1}>
                      <div style={{marginBottom: '30px', border: '1px solid #ccc', borderRadius: '0px'}} className='ui-block'>
                        <div style={{padding: '5px'}}>
                          {!this.props.titleEditable
                                ? <h3> {this.state.convoTitle} </h3>
                                : <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                              }
                        </div>
                      </div>
                    </StickyDiv>
                    <GenericMessageComponents hiddenComponents={this.state.hiddenComponents} addComponent={this.showAddComponentModal} />
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                    {
                    this.state.isShowingModal &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={this.closeDialog}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={this.closeDialog}>
                        <h3>Rename:</h3>
                        <input style={{maxWidth: '300px', float: 'left', margin: 2}} ref={(c) => { this.titleConvo = c }} placeholder={this.state.convoTitle} type='text' className='form-control' />
                        <button style={{float: 'left', margin: 2}} onClick={this.renameTitle} className='btn btn-primary btn-sm' type='button'>Save</button>
                      </ModalDialog>
                    </ModalContainer>
                    }
                    {/* {
                      <Modal
                        isOpen={this.state.isShowingAddComponentModal}
                        onRequestClose={this.closeAddComponentModal}
                        contentLabel='Example Modal'
                     >
                        <h2>Hello</h2>
                        <button onClick={this.closeAddComponentModal}>close</button>
                        <div>I am a modal</div>
                        <form>
                          <input />
                          <button>tab navigation</button>
                          <button>stays</button>
                          <button>inside</button>
                          <button>the modal</button>
                        </form>
                      </Modal>
                    } */}
                    {
                    this.state.isShowingAddComponentModal && this.openModal()
                    }
                    {
                    this.state.isShowingModalResetAlert &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={this.closeResetAlertDialog}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={this.closeResetAlertDialog}>
                        <p>Are you sure you want to reset the message ?</p>
                        <button style={{float: 'right', marginLeft: '10px'}}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.newConvo()
                            this.closeResetAlertDialog()
                          }}>Yes
                        </button>
                        <button style={{float: 'right'}}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.closeResetAlertDialog()
                          }}>Cancel
                        </button>
                      </ModalDialog>
                    </ModalContainer>
                    }
                    <div className='iphone-x' style={{height: !this.props.noDefaultHeight ? 90 + 'vh' : null, marginTop: '15px', paddingRight: '10%', paddingLeft: '10%', paddingTop: 100}}>
                      {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                      <DragSortableList style={{overflowY: 'scroll', height: '75vh'}} items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />
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
  'hideUserOptions': PropTypes.bool
}

GenericMessage.defaultProps = {
  'convoTitle': 'Title',
  'hiddenComponents': [],
  'titleEditable': false,
  'broadcast': []
}

export default GenericMessage
