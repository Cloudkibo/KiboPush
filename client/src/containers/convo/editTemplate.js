/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { loadBroadcastDetails, saveBroadcastInformation } from '../../redux/actions/templates.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { createWelcomeMessage } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { checkConditions } from '../polls/utility'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import File from './File'
import List from './List'
import Text from './Text'
import Card from './Card'
import Gallery from './Gallery'
import Targeting from './Targeting'
import { validateFields } from './utility'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { Link } from 'react-router'
import { registerAction } from '../../utility/socketio'
import {loadTags} from '../../redux/actions/tags.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      stayOpen: false,
      disabled: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      isShowingModal: false,
      convoTitle: 'Broadcast Title',
      showMessengerModal: false,
      isShowingModalGuideLines: false,
      stay: false,
      listSelected: '',
      isList: false,
      lists: [],
      tabActive: 'broadcast',
      resetTarget: false
    }
    props.getuserdetails()
    props.getFbAppId()
    props.getAdminSubscriptions()
    props.loadTags()
    props.loadSubscribersList()
    if (this.props.location.state && this.props.location.state.module === 'welcome') {
      this.setEditComponents(this.props.location.state.payload)
    } else if (props.currentBroadcast) {
      const id = this.props.currentBroadcast._id
      props.loadBroadcastDetails(id)
    }
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.testConvo = this.testConvo.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.handleSendBroadcast = this.handleSendBroadcast.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.backToTemplates = this.backToTemplates.bind(this)
    this.goBack = this.goBack.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
  }
//  sddsdfas
  componentWillMount () {
    // this.props.loadMyPagesList();
    // if(this.props.pages.length > 0){
    //   this.setState({pageValue: this.props.pages[0].pageId})
    // }
  }
  showResetAlertDialog () {
    if (this.state.broadcast.length > 0 || this.state.list.length > 0) {
      this.setState({isShowingModalResetAlert: true})
    }
  }

  closeResetAlertDialog () {
    this.setState({isShowingModalResetAlert: false})
  }
  handleSendBroadcast () {
    this.initTab()
  }
  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }
  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
  }
  handleTargetValue (targeting) {
    this.setState({
      listSelected: targeting.listSelected,
      pageValue: targeting.pageValue,
      genderValue: targeting.genderValue,
      localeValue: targeting.localeValue,
      tagValue: targeting.tagValue
    })
  }
  onNext () {
    /* eslint-disable */
    $('[href="#tab_1"]').removeClass('active')
    $('[href="#tab_2"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'target'})
  }
  onPrevious () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    $('[href="#tab_1"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  initTab () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    $('[href="#tab_1"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onBroadcastClick () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast', resetTarget: false})
  }
  onTargetClick () {
    /* eslint-disable */
    $('[href="#tab_1"]').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'target'})
  }
  componentWillReceiveProps (nextprops) {
    if (this.props.location.state && this.props.location.state.module === 'welcome') {
      this.setEditComponents(this.props.location.state.payload)
    } else if (nextprops.broadcastDetails) {
      if (this.state.stay === false) {
        this.setState({convoTitle: nextprops.broadcastDetails.title})
        this.setEditComponents(nextprops.broadcastDetails.payload)
      }
    }
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
    document.title = 'KiboPush | Create Broadcast'
    this.scrollToTop()
    this.initTab()
    // if (this.props.pages.length > 0) {
    //   var temp = []
    //   for (var j = 0; j < this.props.pages.length; j++) {
    //     temp.push(this.props.pages[j].pageId)
    //   }
    //   this.setState({pageValue: temp})
    // }
    var compProp = this.props
    var comp = this
    registerAction({
      event: 'admin_subscriber',
      action: function (data) {
        compProp.getAdminSubscriptions()
        comp.setState({showMessengerModal: false})
        comp.msg.success('Subscribed successfully. Click on the test button again to test')
      }
    })
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  backToTemplates () {
    this.props.history.push({
      pathname: `/showTemplateBroadcasts`
    })
  }
  renameTitle () {
    if (this.titleConvo.value === '') {
      return
    }
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
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
    var temp = this.state.broadcast
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        // var newObj = {}
        // newObj.image_url = obj.cards.image
        // newObj.subtitle = obj.cards.subtitle
        // newObj.title = obj.cards.title

        temp[i].listItems = obj.listItems
        temp[i].topElementStyle = obj.topElementStyle
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
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
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    //  this.setState({tabActive: 'broadcast'})
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var isSegmentedValue = false
    if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0 || this.state.tagValue.length > 0) {
      isSegmentedValue = true
    }

    if (this.props.location.state && this.props.location.state.module === 'welcome') {
      console.log('broadcast state', this.state.broadcast)
      this.props.createWelcomeMessage({_id: this.props.location.state._id, welcomeMessage: this.state.broadcast}, this.msg)
    } else {
      var res = checkConditions(this.state.pageValue, this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers)
      if (res === false) {
        this.msg.error('No subscribers match the selected criteria')
      } else {
        let tagIDs = []
        for (let i = 0; i < this.props.tags.length; i++) {
          for (let j = 0; j < this.state.tagValue.length; j++) {
            if (this.props.tags[i].tag === this.state.tagValue[j]) {
              tagIDs.push(this.props.tags[i]._id)
            }
          }
        }
        var data = {
          platform: 'facebook',
          payload: this.state.broadcast,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationLocale: this.state.localeValue,
          segmentationGender: this.state.genderValue,
          segmentationTimeZone: '',
          segmentationTags: tagIDs,
          title: this.state.convoTitle,
          segmentationList: this.state.listSelected,
          isList: isListValue
        }
        console.log('Sending Broadcast', data)
        this.props.sendBroadcast(data, this.msg, this.handleSendBroadcast)
        //  this.setState({broadcast: [], list: []})
      }
    }
    this.setState({stay: true})
  }

  testConvo () {
    if (this.state.pageValue.length > 1 || this.state.pageValue.length === 0) {
      this.msg.error('Only one page should be selected to test the broadcast')
    } else {
      var check = this.props.adminPageSubscription.filter((obj) => { return obj.pageId.pageId === this.state.pageValue[0] })
      if (check.length <= 0) {
        this.setState({showMessengerModal: true})
        return
      }
      // for (let i = 0; i < this.props.pages.length; i++) {
      //   if (this.props.pages[i].pageId === this.state.pageValue) {
      //     if (!this.props.pages[i].adminSubscriberId) {
            // this.setState({showMessengerModal: true})
            // return
      //     }
      //   }
      // }
      //
      if (this.state.broadcast.length === 0) {
        return
      }
      var isListValue = false
      if (this.state.listSelected.length > 0) {
        isListValue = true
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0 || this.state.tagValue.length > 0) {
        isSegmentedValue = true
      }
      let tagIDs = []
      for (let i = 0; i < this.props.tags.length; i++) {
        for (let j = 0; j < this.state.tagValue.length; j++) {
          if (this.props.tags[i].tag === this.state.tagValue[j]) {
            tagIDs.push(this.props.tags[i]._id)
          }
        }
      }
      var data = {
        platform: 'facebook',
        self: true,
        payload: this.state.broadcast,
        title: this.state.convoTitle,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.pageValue,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags: tagIDs,
        segmentationTimeZone: '',
        segmentationList: this.state.listSelected,
        isList: isListValue

      }
      this.props.sendBroadcast(data, this.msg)
    }
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  goBack () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'welcome'}
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
//    const { disabled, stayOpen } = this.state

    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
          <div className='m-content'>
            { !(this.props.location.state && this.props.location.state.module === 'welcome') &&
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-brand' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding how to create broadcasts? Here is the <a href='http://kibopush.com/broadcast/' target='_blank'>documentation</a>.
                <br />
                View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>
              </div>
            </div>
            }
            <div className='row'>
              <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                <div className='m-portlet m-portlet--mobile'>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        { !(this.props.location.state && this.props.location.state.module === 'welcome')
                        ? <h3 className='m-portlet__head-text'>
                            Create Broadcast
                          </h3>
                        : <h3 className='m-portlet__head-text'>
                            Welcome Message
                          </h3>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='row' >
                      <div className='col-12'>
                        {
                          this.state.tabActive === 'broadcast' && !(this.props.location.state && this.props.location.state.module === 'welcome') &&
                          <div className='pull-right'>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.showResetAlertDialog}>
                              Reset
                            </button>
                            <button className='btn btn-primary' onClick={this.onNext}>
                              Next
                            </button>
                          </div>
                        }
                        {
                          this.state.tabActive === 'target' && !(this.props.location.state && this.props.location.state.module === 'welcome') &&
                          <div className='pull-right'>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                              Previous
                            </button>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.pageValue === '' || (this.state.broadcast.length === 0))} onClick={this.testConvo}>
                              Test
                            </button>
                            <button id='send' onClick={this.sendConvo} disabled={(this.state.broadcast.length === 0)} className='btn btn-primary'>
                              Send
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        { !(this.props.location.state && this.props.location.state.module === 'welcome') &&
                        <ul className='nav nav-tabs'>
                          <li>
                            <a href='#tab_1' data-toggle='tab' aria-expanded='true' className='broadcastTabs' onClick={this.onBroadcastClick}>Broadcast </a>
                          </li>
                          <li>
                            <a href='#tab_2' data-toggle='tab' aria-expanded='true' className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                          </li>
                        </ul>
                        }
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
                                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New List Component Added'); this.setState({list: [...temp, {content: (<List id={temp.length} key={temp.length} handleList={this.handleList} onRemove={this.removeComponent} />)}]}) }}>
                                      <div className='align-center'>
                                        <img src='icons/list.png' alt='List' style={{maxHeight: 25}} />
                                        <h6>List</h6>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                { this.props.location.state && this.props.location.state.module === 'welcome' &&
                                <div className='row'>
                                  <div className='col-12' style={{paddingTop: '50px'}}>
                                    <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                                    <button className='btn btn-primary' onClick={() => this.goBack()}>Back</button>
                                  </div>
                                </div>
                                }
                              </div>
                              <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                                <StickyDiv zIndex={1}>
                                  <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                                    <div style={{padding: '5px'}}>
                                      {this.props.location.state && this.props.location.state.module === 'welcome'
                                        ? <h3>Welcome Message</h3>
                                        : <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                                      }
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
                                {
                                  this.state.isShowingModalGuideLines &&
                                  <ModalContainer style={{width: '500px'}}
                                    onClose={this.closeGuideLinesDialog}>
                                    <ModalDialog style={{width: '500px'}}
                                      onClose={this.closeGuideLinesDialog}>
                                      <h4>Message Types</h4>
                                      <p> Following are the types of broadcasts that can be sent to facebook messenger.</p>
                                      <div className='panel-group accordion' id='accordion1'>
                                        <div className='panel panel-default'>
                                          <div className='panel-heading guidelines-heading'>
                                            <h4 className='panel-title'>
                                              <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Broadcasts</a>
                                            </h4>
                                          </div>
                                          <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                            <div className='panel-body'>
                                              <p>Subscription broadcast messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity.</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='panel panel-default'>
                                          <div className='panel-heading guidelines-heading'>
                                            <h4 className='panel-title'>
                                              <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Broadcasts</a>
                                            </h4>
                                          </div>
                                          <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                            <div className='panel-body'>
                                              Promotional broadcast messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                                            </div>
                                          </div>
                                        </div>
                                        <div className='panel panel-default'>
                                          <div className='panel-heading guidelines-heading'>
                                            <h4 className='panel-title'>
                                              <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Broadcasts</a>
                                            </h4>
                                          </div>
                                          <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                            <div className='panel-body'>
                                              After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </ModalDialog>
                                  </ModalContainer>
                                }
                                {
                                  this.state.showMessengerModal &&
                                  <ModalContainer style={{width: '500px'}}
                                    onClose={() => { this.setState({showMessengerModal: false}) }}>
                                    <ModalDialog style={{width: '500px'}}
                                      onClose={() => { this.setState({showMessengerModal: false}) }}>
                                      <h3>Connect to Messenger:</h3>
                                      <MessengerPlugin
                                        appId={this.props.fbAppId}
                                        pageId={JSON.stringify(this.state.pageValue[0])}
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
                          { !(this.props.location.state && this.props.location.state.module === 'welcome') &&
                          <div className='tab-pane' id='tab_2'>
                            <Targeting handleTargetValue={this.handleTargetValue} resetTarget={this.state.resetTarget} component='broadcast' />
                          </div>
                          }
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
    subscribers: (state.subscribersInfo.subscribers),
    fbAppId: state.basicInfo.fbAppId,
    adminPageSubscription: state.basicInfo.adminPageSubscription,
    tags: (state.tagsInfo.tags)
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
      loadSubscribersList: loadSubscribersList,
      getAdminSubscriptions: getAdminSubscriptions,
      getFbAppId: getFbAppId,
      loadTags: loadTags
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
