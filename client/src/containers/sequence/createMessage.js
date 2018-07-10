/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { editMessage } from '../../redux/actions/sequence.action'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { loadBroadcastDetails, saveBroadcastInformation } from '../../redux/actions/templates.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { createWelcomeMessage } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import List from '../convo/List'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { browserHistory } from 'react-router'

class CreateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      stayOpen: false,
      disabled: false,
      isShowingModal: false,
      convoTitle: 'Broadcast Title',
      stay: false
    }
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.goBack = this.goBack.bind(this)
  }
  componentWillMount () {
    // this.props.loadMyPagesList();
    // if(this.props.pages.length > 0){
    //   this.setState({pageValue: this.props.pages[0].pageId})
    // }
  }

  componentWillReceiveProps (nextprops) {
    // if (nextprops.customerLists) {
    //   let options = []
    //   for (var j = 0; j < nextprops.customerLists.length; j++) {
    //     if (!(nextprops.customerLists[j].initialList)) {
    //       options.push({id: nextprops.customerLists[j]._id, text: nextprops.customerLists[j].listName})
    //     } else {
    //       if (nextprops.customerLists[j].content && nextprops.customerLists[j].content.length > 0) {
    //         options.push({id: nextprops.customerLists[j]._id, text: nextprops.customerLists[j].listName})
    //       }
    //     }
    //   }
    //   this.setState({lists: options})
    //   this.initializeListSelect(options)
    //   if (options.length === 0) {
    //     this.state.selectedRadio = 'segmentation'
    //   }
    // }
    // if (this.props.location.state && this.props.location.state.module === 'welcome') {
    //   this.setEditComponents(this.props.location.state.payload)
    // } else if (nextprops.broadcastDetails) {
    //   if (this.state.stay === false) {
    //     this.setState({convoTitle: nextprops.broadcastDetails.title})
    //     this.setEditComponents(nextprops.broadcastDetails.payload)
    //   }
    // }
  }

  setEditComponents (payload) {
    var temp = []
    var message = []
    for (var i = 0; i < payload.length; i++) {
      payload[i].id = temp.length
      if (payload[i].componentType === 'text') {
        console.log('paload[i].text', payload[i].text)
        console.log('paload[i].buttons', payload[i].buttons)
        temp.push({content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload[i].buttons} removeState />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'image') {
        temp.push({content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'audio') {
        temp.push({content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'video') {
        temp.push({content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'file') {
        temp.push({content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'card') {
        temp.push({content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} singleCard />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'gallery') {
        temp.push({content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'list') {
        temp.push({content: (<List id={temp.length} key={temp.length} handleList={this.handleList} onRemove={this.removeComponent} listDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      }
    }
  }
  componentDidMount () {
    document.title = 'KiboPush | Edit Message'
    this.scrollToTop()
    this.setState({convoTitle: this.props.location.state.title})
    if (this.props.location.state) {
      this.setEditComponents(this.props.location.state.payload)
    }
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  renameTitle () {
    if (this.titleConvo.value === '') {
      return
    }
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    this.setState({ localeValue: temp })
  }

  handleText (obj) {
    var temp = this.state.broadcast
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
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
  }

  handleCard (obj) {
    var temp = this.state.broadcast
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
    this.setState({broadcast: temp})
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        // var newObj = {}
        // newObj.image_url = obj.cards.image
        // newObj.subtitle = obj.cards.subtitle
        // newObj.title = obj.cards.title

        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleList (obj) {
    console.log('obj', obj)
    var temp = this.state.broadcast
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data) => {
      if (data.id === obj.id) {
        data.listItems = obj.listItems
        data.topElementStyle = obj.topElementStyle
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    console.log('temp', temp)
    this.setState({broadcast: temp})
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
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  sendConvo () {
    if (this.state.broadcast.length === 0) {
      return
    }
    for (let i = 0; i < this.state.broadcast.length; i++) {
      if (this.state.broadcast[i].componentType === 'card') {
        if (!this.state.broadcast[i].buttons) {
          return this.msg.error('Card must have at least one button.')
        } else if (this.state.broadcast[i].buttons.length === 0) {
          return this.msg.error('Card must have at least one button.')
        }
      }
      if (this.state.broadcast[i].componentType === 'gallery') {
        for (let j = 0; j < this.state.broadcast[i].cards.length; j++) {
          if (!this.state.broadcast[i].cards[j].buttons) {
            return this.msg.error('Card in gallery must have at least one button.')
          } else if (this.state.broadcast[i].cards[j].buttons.length === 0) {
            return this.msg.error('Card in gallery must have at least one button.')
          }
        }
      }
      if (this.state.broadcast[i].componentType === 'list') {
        if (this.state.broadcast[i].listItems && this.state.broadcast[i].listItems.length < 2) {
          return this.msg.error('A list must have atleast 2 elements')
        }
        if (this.state.broadcast[i].topElementStyle === 'LARGE' && this.state.broadcast[i].listItems[0].image_url === '') {
          return this.msg.error('Please select an image for top item with large style in list')
        }
        for (let j = 0; j < this.state.broadcast[i].listItems.length; j++) {
          if (!this.state.broadcast[i].listItems[j].title) {
            return this.msg.error('Element in list must have a title.')
          } else if (!this.state.broadcast[i].listItems[j].subtitle) {
            return this.msg.error('Element in list must have a subtitle.')
          }
        }
      }
    }
    console.log('edit Message', this.state.broadcast)
    this.props.editMessage({_id: this.props.location.state.messageId, title: this.state.convoTitle, payload: this.state.broadcast}, this.msg)
    this.setState({stay: true})
    browserHistory.push({
      pathname: `/viewMessage`,
      state: {title: this.state.convoTitle, payload: this.state.broadcast, id: this.props.location.state.id, messageId: this.props.location.state.messageId}
    })
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  goBack () {
    //  this.props.createSequence({name: this.state.name})
    if (this.props.location.state.payload && this.props.location.state.payload.length > 0) {
      browserHistory.push({
        pathname: `/viewMessage`,
        state: {title: this.props.location.state.title, payload: this.props.location.state.payload, id: this.props.location.state.id, messageId: this.props.location.state.messageId}
      })
    } else {
      browserHistory.push({
        pathname: `/editSequence`,
        state: {module: 'view', _id: this.props.location.state.id, name: this.props.location.state.title}
      })
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

    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Edit Message
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-secondary' onClick={() => this.goBack()} style={{marginRight: '10px'}}>Cancel</button>
                        <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row'>
                        <div className='col-12'>
                          <div className='tab-content'>
                            <div className='tab-pane fade active in' id='tab_1'>
                              <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                                  <div className='row' >
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} removeState />)}]}) }}>
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
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />)}]}) }}>
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
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New List Component Added'); this.setState({list: [...temp, {content: (<List id={temp.length} key={temp.length} handleList={this.handleList} onRemove={this.removeComponent} sequence={true} />)}]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/list.png' alt='List' style={{maxHeight: 25}} />
                                          <h6>List</h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                                  <StickyDiv zIndex={1}>
                                    <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                                      <div style={{padding: '5px'}}>
                                        <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                                      </div>
                                    </div>
                                  </StickyDiv>
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
                                  <div className='ui-block' style={{height: 90 + 'vh', overflowY: 'scroll', marginTop: '-15px', paddingLeft: 75, paddingRight: 75, paddingTop: 30, borderRadius: '0px', border: '1px solid #ccc'}}>
                                    {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}

                                    <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' style={{position: 'initial'}} />

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo),
    user: (state.basicInfo.user),
    broadcastDetails: (state.templatesInfo.broadcastDetails),
    currentBroadcast: (state.templatesInfo.currentBroadcast),
    customerLists: (state.listsInfo.customerLists),
    subscribers: (state.subscribersInfo.subscribers),
    fbAppId: state.basicInfo.fbAppId,
    adminPageSubscription: state.basicInfo.adminPageSubscription
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      loadBroadcastDetails: loadBroadcastDetails,
      saveBroadcastInformation: saveBroadcastInformation,
      createWelcomeMessage: createWelcomeMessage,
      loadCustomerLists: loadCustomerLists,
      loadSubscribersList: loadSubscribersList,
      getAdminSubscriptions: getAdminSubscriptions,
      getFbAppId: getFbAppId,
      editMessage: editMessage
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
