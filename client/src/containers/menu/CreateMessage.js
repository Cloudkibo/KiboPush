/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import List from '../convo/List'
import Media from '../convo/Media'
import { validateFields } from '../convo/utility'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { saveCurrentMenuItem } from '../../redux/actions/menu.actions'
import StickyDiv from 'react-stickydiv'
import { onClickText, onImageClick, onCardClick, onGalleryClick, onAudioClick, onVideoClick, onFileClick, onListClick, onMediaClick } from '../menu/utility'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      message: [],
      stayOpen: false,
      disabled: false,
      pageValue: '',
      isShowingModal: false,
      messageTitle: 'Message Title',
      showMessengerModal: false,
      itemMenus: []
    }
    // props.getuserdetails()
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleMedia = this.handleMedia.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.setCreateMessage = this.setCreateMessage.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.getPayloadByIndex = this.getPayloadByIndex.bind(this)
    this.gotoMenu = this.gotoMenu.bind(this)
  }

  gotoMenu () {
    this.props.history.push({
      pathname: `/menu`,
      state: {action: 'replyWithMessage'}
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }
  getPayloadByIndex (index) {
    var payload = []
    var currentMenuItem = this.props.currentMenuItem
    var menu = this.getMenuHierarchy(this.props.currentMenuItem.clickedIndex)
    switch (menu) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (currentMenuItem.itemMenus[index[1]].payload && currentMenuItem.itemMenus[index[1]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].payload
        }
        break
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        if (currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload && currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload
        }
        break
      case 'nestedMenu':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload && currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        break
      default:
        break
    }
    if (payload.length > 0) {
      return JSON.parse(payload)
    }
    return payload
  }
  componentDidMount () {
    document.title = 'KiboPush | Menu'
    if (this.props.currentMenuItem.itemMenus && this.props.currentMenuItem.itemMenus.length > 0) {
      var index = this.props.currentMenuItem.clickedIndex.split('-')
      var payload = this.getPayloadByIndex(index)
      if (payload && payload.length > 0) {
        this.setEditComponents(payload)
      }
    }
    // let options = []
    // this.setState({ page: { options: options } })
  }
  setEditComponents (payload) {
    var temp = []
    var message = []
    for (var i = 0; i < payload.length; i++) {
      if (payload[i].componentType === 'text') {
        temp.push({content: (<Text id={payload[i].id} key={payload[i].id} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload[i].buttons} removeState />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'image') {
        temp.push({content: (<Image id={payload[i].id} key={payload[i].id} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'audio') {
        temp.push({content: (<Audio id={payload[i].id} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'video') {
        temp.push({content: (<Video id={payload[i].id} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'file') {
        temp.push({content: (<File id={payload[i].id} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'card') {
        temp.push({content: (<Card id={payload[i].id} key={payload[i].id} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} singleCard />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'gallery') {
        if (payload[i].cards) {
          for (var m = 0; m < payload[i].cards.length; m++) {
            payload[i].cards[m].id = m
          }
        }
        temp.push({content: (<Gallery id={payload[i].id} key={payload[i].id} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'list') {
        temp.push({content: (<List id={payload[i].id} key={payload[i].id} list={payload[i]} cards={payload[i].listItems} handleList={this.handleList} onRemove={this.removeComponent} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'media') {
        temp.push({content: (<Media id={payload[i].id} key={payload[i].id} handleMedia={this.handleMedia} onRemove={this.removeComponent} media={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      }
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.currentMenuItem) {
      //  this.setState({ itemMenus: true })
    }
  }
  showDialog () {
    this.setState({ isShowingModal: true })
  }

  closeDialog () {
    this.setState({ isShowingModal: false })
  }

  renameTitle () {
    this.setState({ messageTitle: this.titleMessage.value })
    this.closeDialog()
  }

  handleText (obj) {
    var temp = this.state.message
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
        } else {
          delete temp[i].buttons
        }
        isPresent = true
      }
    })
    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({ id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button })
      } else {
        temp.push({ id: obj.id, text: obj.text, componentType: 'text' })
      }
    }
    this.setState({ message: temp })
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
    var temp = this.state.message
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].mediaType = obj.mediaType
        temp[i].fileurl = obj.fileurl
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
  }
  handleCard (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.state.message
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].image_url = obj.image_url
        temp[i].fileurl = obj.fileurl
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({ message: temp })
  }

  handleGallery (obj) {
    var temp = this.state.message
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({ message: temp })
  }

  handleImage (obj) {
    var temp = this.state.message
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
    //  var temp = obj
    this.setState({ message: temp })
  }

  handleFile (obj) {
    var temp = this.state.message
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

    this.setState({ message: temp })
  }
  handleList (obj) {
    var temp = this.state.message
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].listItems = obj.listItems
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    console.log('temp', temp)
    this.setState({message: temp})
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.message.filter((component) => { return (component.id !== obj.id) })
    this.setState({ list: temp, message: temp2 })
    var updatedMenuItem = this.setCreateMessage(this.props.currentMenuItem.clickedIndex, temp2, false)
    var currentState = { itemMenus: updatedMenuItem, clickedIndex: this.props.currentMenuItem.clickedIndex, currentPage: this.props.currentMenuItem.currentPage }
    this.props.saveCurrentMenuItem(currentState)
  }
  getMenuHierarchy (indexVal) {
    var index = indexVal.split('-')
    var menu = ''
    if (index && index.length > 1) {
      if (index.length === 2) {
        menu = 'item'
      } else if (index.length === 3) {
        menu = 'submenu'
      } else if (index.length === 4) {
        menu = 'nestedMenu'
      } else {
        menu = 'invalid'
      }
    }
    return menu
  }
  setCreateMessage (clickedIndex, payload, saveMessage) {
    var temp = this.props.currentMenuItem.itemMenus
    var index = clickedIndex.split('-')
    var error = false
    var menu = this.getMenuHierarchy(clickedIndex)
    switch (menu) {
      case 'item':
        var temp1 = []
        for (var i = 0; i < payload.length; i++) {
          temp1.push(payload[i])
        }
        if (saveMessage && JSON.stringify(temp1).length > 1000) {
          this.msg.error('Message is too long')
          error = true
          break
        }
        temp[index[1]].payload = JSON.stringify(temp1)
        break
      case 'submenu':
        var temp2 = []
        for (var j = 0; j < payload.length; j++) {
          temp2.push(payload[j])
        }
        if (saveMessage && JSON.stringify(temp2).length > 1000) {
          this.msg.error('Message is too long')
          error = true
          break
        }
        temp[index[1]].submenu[index[2]].payload = JSON.stringify(temp2)
        break
      case 'nestedMenu':
        var temp3 = []
        for (var k = 0; k < payload.length; k++) {
          temp3.push(payload[k])
        }
        if (saveMessage && JSON.stringify(temp3).length > 1000) {
          this.msg.error('Message is too long')
          error = true
          break
        }
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = JSON.stringify(temp3)
        break
      default:
        break
    }
    if (error) {
      temp = ''
    }
    return temp
  }

  saveMessage () {
    if (!validateFields(this.state.message, this.msg)) {
      return
    }
    var saveMessage = true
    var currentState
    var updatedMenuItem = this.setCreateMessage(this.props.currentMenuItem.clickedIndex, this.state.message, saveMessage)
    if (updatedMenuItem !== '') {
      currentState = { itemMenus: updatedMenuItem, clickedIndex: this.props.currentMenuItem.clickedIndex, currentPage: this.props.currentMenuItem.currentPage }
      this.props.saveCurrentMenuItem(currentState)
      this.msg.success('Message Saved Successfully')
    } else {
      currentState = { itemMenus: this.props.currentMenuItem.itemMenus, clickedIndex: this.props.currentMenuItem.clickedIndex, currentPage: this.props.currentMenuItem.currentPage }
      this.props.saveCurrentMenuItem(currentState)
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    let timeStamp = new Date().getTime()

    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>

            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div style={{padding: '25px'}} className='row' />
              <div>
                <div className='row' >
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' id='text' onClick={() => { onClickText(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                        <h6>Text</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onImageClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                        <h6>Image</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onCardClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                        <h6>Card</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onGalleryClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                        <h6>Gallery</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onAudioClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                        <h6>Audio</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onVideoClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                        <h6>Video</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onFileClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                        <h6>File</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onListClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/list.png' alt='List' style={{maxHeight: 25}} />
                        <h6>List</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { onMediaClick(timeStamp, this) }}>
                      <div className='align-center'>
                        <img src='icons/media.png' alt='Media' style={{maxHeight: 25}} />
                        <h6>Media</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className='row'>
                  <br />
                  <br />
                  <button style={{float: 'left', marginLeft: 20}} id='save' onClick={() => this.saveMessage()} className='btn btn-primary' disabled={(this.state.message.length === 0)}> Save </button>
                  <button onClick={this.gotoMenu} style={{float: 'left', marginLeft: 20}} id='send1' className='btn btn-primary'> Back </button>
                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div style={{padding: '25px'}} className='row' />
              <StickyDiv zIndex={1}>
                <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                  <div style={{padding: '5px'}}>
                    <h3>Message</h3>
                  </div>
                  {
                    JSON.stringify(this.props.currentMenuItem.menuitems)
                  }
                </div>
              </StickyDiv>

              {
            this.state.showMessengerModal &&
            <ModalContainer style={{width: '500px'}}
              onClose={() => { this.setState({showMessengerModal: false}) }}>
              <ModalDialog style={{width: '500px'}}
                onClose={() => { this.setState({showMessengerModal: false}) }}>
                <h3>Connect to Messenger:</h3>
                <MessengerPlugin
                  appId='1429073230510150'
                  pageId={this.state.pageValue}
                  passthroughParams={this.props.user._id}
                  onClick={() => { this.setState({showMessengerModal: false}) }}
                />
              </ModalDialog>
            </ModalContainer>
          }
              <div className='ui-block' style={{height: 90 + 'vh', overflowY: 'scroll', marginTop: '-15px', paddingLeft: 75, paddingRight: 75, paddingTop: 30, borderRadius: '0px', border: '1px solid #ccc'}}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

              </div>

            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentMenuItem: (state.menuInfo.currentMenuItem)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      saveCurrentMenuItem: saveCurrentMenuItem
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
