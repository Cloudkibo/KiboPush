/**
 * Created by ahsan on 23/04/2018.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Image from '../menu/Image'
import Video from '../menu/Video'
import Audio from '../menu/Audio'
import File from '../menu/File'
import Text from '../menu/Text'
import Card from '../menu/Card'
import Gallery from '../menu/Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { saveMessageSeq } from '../../redux/actions/sequence.action'
import StickyDiv from 'react-stickydiv'
import { Link } from 'react-router'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateMessageSeq extends React.Component {
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
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.setCreateMessage = this.setCreateMessage.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
  }
  componentDidMount () {
    document.title = 'KiboPush | Create Message'
    // if (this.props.currentMenuItem.itemMenus && this.props.currentMenuItem.itemMenus.length > 0) {
    //   var index = this.props.currentMenuItem.clickedIndex.split('-')
    //   // var payload = this.getPayloadByIndex(index)
    //   // if (payload && payload.length > 0) {
    //   //   this.setEditComponents(payload)
    //   // }
    // }
    // let options = []
    // this.setState({ page: { options: options } })
  }
  setEditComponents (payload) {
    var temp = []
    var message = []
    for (var i = 0; i < payload.length; i++) {
      payload[i].id = temp.length
      if (payload[i].componentType === 'text') {
        temp.push({content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload.buttons} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'image') {
        temp.push({content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'audio') {
        temp.push({content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'video') {
        temp.push({content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'file') {
        temp.push({content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'card') {
        temp.push({content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
      } else if (payload[i].componentType === 'gallery') {
        temp.push({content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({message: message})
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

  handleCard (obj) {
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

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.message.filter((component) => { return (component.id !== obj.id) })
    this.setState({ list: temp, message: temp2 })
    var updatedMenuItem = this.setCreateMessage(this.props.currentMenuItem.clickedIndex, temp2)
    var currentState = { itemMenus: updatedMenuItem, clickedIndex: this.props.currentMenuItem.clickedIndex, currentPage: this.props.currentMenuItem.currentPage }
    this.props.saveMessageSeq(currentState)
  }

  setCreateMessage (clickedIndex, payload) {
    var temp = this.props.currentMenuItem.itemMenus
    var index = clickedIndex.split('-')
    switch (index[0]) {
      case 'item':
        var temp1 = []
        for (var i = 0; i < payload.length; i++) {
          temp1.push(payload[i])
        }
        temp[index[1]].payload = JSON.stringify(temp1)
        break
      case 'submenu':
        var temp2 = []
        for (var j = 0; j < payload.length; j++) {
          temp2.push(payload[j])
        }
        temp[index[1]].submenu[index[2]].payload = JSON.stringify(temp2)
        break
      case 'nested':
        var temp3 = []
        for (var k = 0; k < payload.length; k++) {
          temp3.push(payload[k])
        }
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = JSON.stringify(temp3)
        break
      default:
        break
    }
    return temp
  }

  saveMessage () {
    if (this.state.message.length === 0) {
      return
    }
    for (let i = 0; i < this.state.message.length; i++) {
      if (this.state.message[i].componentType === 'card') {
        if (!this.state.message[i].title) {
          return this.msg.error('Card must have a title')
        }
        if (!this.state.message[i].description) {
          return this.msg.error('Card must have a subtitle')
        }
        if (!this.state.message[i].buttons) {
          return this.msg.error('Card must have at least one button.')
        } else if (this.state.message[i].buttons.length === 0) {
          return this.msg.error('Card must have at least one button.')
        }
      }
      if (this.state.message[i].componentType === 'gallery') {
        for (let j = 0; j < this.state.message[i].cards.length; j++) {
          if (!this.state.message[i].cards[j].title) {
            return this.msg.error('Card in gallery must have a title')
          }
          if (!this.state.message[i].cards[j].subtitle) {
            return this.msg.error('Card in gallery must have a subtitle')
          }
          if (!this.state.message[i].cards[j].buttons) {
            return this.msg.error('Card in gallery must have at least one button.')
          } else if (this.state.message[i].cards[j].buttons.length === 0) {
            return this.msg.error('Card in gallery must have at least one button.')
          }
        }
      }
    }
    var updatedMenuItem = this.setCreateMessage(this.props.currentMenuItem.clickedIndex, this.state.message)
    var currentState = { itemMenus: updatedMenuItem, clickedIndex: this.props.currentMenuItem.clickedIndex, currentPage: this.props.currentMenuItem.currentPage }
    this.props.saveMessageSeq(currentState)
    this.msg.success('Message Saved Successfully')
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        {
      }
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>

                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <div>
                    <div className='row' >
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} component='text' key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                            <h6>Text</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, {content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                            <h6>Image</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                            <h6>Card</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                            <h6>Gallery</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, {content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                            <h6>Audio</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, {content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                            <h6>Video</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                            <h6>File</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className='row'>
                      <br />
                      <br />
                      <button style={{float: 'left', marginLeft: 20}} id='save' onClick={() => this.saveMessage()} className='btn btn-primary' disabled={(this.state.message.length === 0)}> Save </button>
                      <Link to='menu' style={{float: 'left', marginLeft: 20}} id='send1' className='btn btn-primary'> Back </Link>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <StickyDiv offsetTop={70} zIndex={1}>
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
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    // currentMenuItem: (state.menuInfo.currentMenuItem)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      saveMessageSeq: saveMessageSeq
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessageSeq)
