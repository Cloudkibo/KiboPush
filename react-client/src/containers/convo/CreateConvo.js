/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  sendBroadcast,
  getSubscriberCount
} from '../../redux/actions/broadcast.actions'
import { loadSubscribersCount } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
// import { Link } from 'react-router-dom'
// import { checkConditions } from '../polls/utility'
import { validateFields } from './utility'
// import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import {loadTags} from '../../redux/actions/tags.actions'
import BUILDER from '../../components/SimplifiedBroadcastUI/builder/builders'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview', 'unsubscribe sequence', 'subscribe sequence', 'set custom field', 'create message', 'google sheets', 'hubspot'],
      broadcast: this.props.location.state && this.props.location.state.payload ? this.props.location.state.payload : [],
      stayOpen: false,
      disabled: false,
      linkedMessages: null,
      unlinkedMessages: null,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      isShowingModal: false,
      isShowingModalResetAlert: false,
      convoTitle: this.props.location.state && this.props.location.state.title ? this.props.location.state.title : 'Broadcast Title',
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: [],
      tabActive: 'broadcast',
      resetTarget: false,
      setTarget: false,
      invalidSessionMessage: '',
      pageId: this.props.location.state && this.props.pages && this.props.location.state.pages && this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])[0],
      loadScript: true,
      messageType: '',
      subscriberCount: 0,
      totalSubscribersCount: 0,
      isApprovedForSMP: false,
      locationPages: this.props.location.state ? this.props.location.state.pages : [],
      showBuilderDropdown: false,
      builderValue: 'basic'
    }
    props.getuserdetails()
    props.getFbAppId()
    props.getAdminSubscriptions()
    props.loadTags()
    this.handleSendBroadcast = this.handleSendBroadcast.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.testConvo = this.testConvo.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.loadsdk = this.loadsdk.bind(this)
    this.handleSubscriberCount = this.handleSubscriberCount.bind(this)
    this.toggleBuilderDropdown = this.toggleBuilderDropdown.bind(this)
    this.switchBuilder = this.switchBuilder.bind(this)
    this.closeBuilderDropdown = this.closeBuilderDropdown.bind(this)
    this.rerenderFlowBuilder = this.rerenderFlowBuilder.bind(this)
    this.isBroadcastInvalid = this.isBroadcastInvalid.bind(this)
    this.deleteButtonIds = this.deleteButtonIds.bind(this)
    this.deleteQuickReplyIds = this.deleteQuickReplyIds.bind(this)
    this.checkForInvalidButtons = this.checkForInvalidButtons.bind(this)
  }

  deleteQuickReplyIds (linkedMessages) {
    for (let i = 0; i < linkedMessages.length; i++) {
      let messageContent = linkedMessages[i].messageContent
      for (let j = 0; j < messageContent.length; j++) {
        if (messageContent[j].quickReplies) {
          for (let k = 0; k < messageContent[j].quickReplies.length; k++) {
            delete messageContent[j].quickReplies[k].id
          }
        }
      }
    }
  }


  deleteButtonIds (linkedMessages) {
    for (let i = 0; i < linkedMessages.length; i++) {
      let messageContent = linkedMessages[i].messageContent
      for (let j = 0; j < messageContent.length; j++) {
        let buttons = []
        if (messageContent[j].cards) {
          for (let m = 0;  m < messageContent[j].cards.length; m++) {
            buttons = buttons.concat(messageContent[j].cards[m].buttons)
          }
        } else if (messageContent[j].buttons) {
          buttons = messageContent[j].buttons
        }
        for (let k = 0; k < buttons.length; k++) {
          delete buttons[k].id
        }
      }
    }
  }

  toggleBuilderDropdown () {
    this.setState({
      showBuilderDropdown: !this.state.showBuilderDropdown
    })
  }

  closeBuilderDropdown (flag) {
    flag && this.setState({
      showBuilderDropdown: false
    })
  }

  switchBuilder (value) {
    if (this.state.builderValue === value) {
      this.setState({
        showBuilderDropdown: false
      })
    } else {
      this.setState({
        builderValue: value,
        showBuilderDropdown: false
      })
    }
  }

  handleChange (state) {
    console.log('handleChange in CreateConvo', state)
    // if (this.state.builderValue === 'flow') {
    //   this.setState({builderValue: 'basic'}, () => {
    //     state.builderValue = 'flow'
    //     this.setState(state)
    //   })
    // } else {
      this.setState(state)
    // }
  }

  rerenderFlowBuilder () {
    this.setState({builderValue: 'basic'}, () => {
      this.setState({builderValue: 'flow'})
    })
  }

  onNext (e) {
    console.log('in onNext', this.state.linkedMessages[0])
    if (this.state.unlinkedMessages && this.state.unlinkedMessages.length > 0) {
      this.msg.error('You have some unlinked message blocks')
    } else if (validateFields(this.state.linkedMessages[0], this.msg)) {
      if (!this.checkForInvalidButtons()) {
        /* eslint-disable */
        $('#tab_1').removeClass('active')
        $('#tab_2').addClass('active')
        $('#titleBroadcast').removeClass('active')
        $('#titleTarget').addClass('active')
        /* eslint-enable */
        this.setState({tabActive: 'target'})
        const payload = {
          pageId: this.state.pageId._id,
          pageAccessToken: this.state.pageId.accessToken,
          segmented: false,
          isList: false,
        }
        this.props.getSubscriberCount(payload, this.handleSubscriberCount)
      }
    }
  }

  handleSubscriberCount(response) {
    this.setState({
      subscriberCount: response.payload.count,
      totalSubscribersCount: response.payload.totalCount,
      isApprovedForSMP: response.payload.isApprovedForSMP
    })
  }

  onPrevious () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }

  handleTargetValue (targeting) {
    this.setState({
      listSelected: targeting.listSelected,
      pageValue: targeting.pageValue,
      genderValue: targeting.genderValue,
      localeValue: targeting.localeValue,
      tagValue: targeting.tagValue,
      messageType: targeting.messageTypeSelectedRadio
    })
    let data = {}
    console.log(this.state.locationPages)
    if (targeting.pageValue.length > 0) {
      data['pageValue'] = this.state.locationPages
    }
    if (targeting.genderValue.length > 0) {
      data['genderValue'] = targeting.genderValue
    }
    if (targeting.localeValue.length > 0) {
      data['localeValue'] = targeting.localeValue
    }
    if (targeting.tagValue.length > 0) {
      data['tagValue'] = targeting.tagValue
    }
    this.props.loadSubscribersCount(data)
    var payload = {
        pageId: this.state.locationPages[0],
        pageAccessToken: this.state.pageId.accessToken,
        segmented: true,
        segmentationGender: targeting.genderValue,
        segmentationLocale: targeting.localeValue,
        segmentationTags: targeting.tagValue,
        isList: targeting.isList ? true : false,
        segmentationList: targeting.listSelected
    }
    this.props.getSubscriberCount(payload, this.handleSubscriberCount)
  }
  initTab () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }

  loadsdk (fbAppId) {
    console.log('inside loadsdk', fbAppId)
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: fbAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.2'
      })
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
    this.setState({loadScript: false})
    if (window.FB) {
      console.log('inside window.fb')
      window.FB.XFBML.parse()
    }
  }

  handleSendBroadcast (res) {
    if (res.status === 'success') {
      this.initTab()
      this.reset(false)
      this.setState({resetTarget: true})
    } else if (res.status === 'INVALID_SESSION') {
      this.setState({invalidSessionMessage: res.description})
      this.refs.reconnect.click()
    }
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    console.log('componentDidMount for CreateConvo', this.state)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Broadcast`
    this.scrollToTop()
    this.initTab()

    document.getElementById('builder-dropdown').addEventListener('click', () => {
      this.close = false
    })
    document.getElementById('builder-dropdown-area').addEventListener('click', () => {
      this.close = false
    })
    document.addEventListener('click', () => {
      if (this.state.showBuilderDropdown && this.close) {
        this.closeBuilderDropdown(true)
      } else if (!this.close) {
        this.close = true
      }
    })

    var compProp = this.props
    var comp = this
    registerAction({
      event: 'admin_subscriber',
      action: function (data) {
        compProp.getAdminSubscriptions()
        comp.msg.success('Subscribed successfully. Click on the test button again to test')
      }
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
    }

    if (nextProps.fbAppId && this.state.loadScript) {
      this.loadsdk(nextProps.fbAppId)
    }
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/broadcasts`

    })
  }

  sendConvo () {
    console.log('in sendConvo', this.state)
    //  this.setState({tabActive: 'broadcast'})
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var isSegmentedValue = false
    if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0 || this.state.tagValue.length > 0) {
      isSegmentedValue = true
    }
    console.log('this.state.locationPages', this.state.locationPages)
    console.log('this.props.pages', this.props.pages)
    // var res = checkConditions([pageId], this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers)
    if (this.state.subscriberCount === 0) {
      this.msg.error('No subscribers match the selected criteria')
    } else {
      // let tagIDs = []
      // for (let i = 0; i < this.props.tags.length; i++) {
      //   for (let j = 0; j < this.state.tagValue.length; j++) {
      //     if (this.props.tags[i].tag === this.state.tagValue[j]) {
      //       tagIDs.push(this.props.tags[i]._id)
      //     }
      //   }
      // }
      console.log('payload before', this.state.linkedMessages[0].messageContent)
      this.deleteButtonIds(this.state.linkedMessages)
      this.deleteQuickReplyIds(this.state.linkedMessages)
      var data = {
        platform: 'facebook',
        payload: this.state.linkedMessages[0].messageContent,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.locationPages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags:  this.state.tagValue,
        segmentationTimeZone: '',
        title: this.state.linkedMessages[0].title,
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
        subscribersCount: this.state.subscriberCount,
        messageType: this.state.messageType,
        isApprovedForSMP: this.state.isApprovedForSMP,
        linkedMessages: this.state.linkedMessages.slice(1, this.state.linkedMessages.length)
      }
      for (let i = 0; i < data.payload.length; i++) {
        if (data.payload[i].componentType === 'list') {
          for (let j = 0; j < data.payload[i].listItems.length; j++) {
            if (data.payload[i].listItems[j].id) {
              delete data.payload[i].listItems[j].id
            }
          }
        }
      }
        //  this.setState({tabActive: 'broadcast'})
      console.log('Sending Broadcast', data)
      this.props.sendBroadcast(data, this.msg, this.handleSendBroadcast)
      this.msg.info('Sending broadcast.... You will be notified when it is sent.')
    }
  }

  isBroadcastInvalid () {
    console.log('isBroadcastInvalid called')
    let linkedMessages = this.state.linkedMessages
    if (!linkedMessages) {
      return true
    } else {
      for (let i = 0; i < linkedMessages.length; i++) {
        if (linkedMessages[i].messageContent.length === 0) {
          return true
        }
      }
      return null
    }
  }

  checkForInvalidButtons () {
    let linkedMessages = this.state.linkedMessages
    for (let i = 0; i < linkedMessages.length; i++) {
      let messageContent = linkedMessages[i].messageContent
      for (let j = 0; j < messageContent.length; j++) {
        let buttons = []
        if (messageContent[j].cards) {
          for (let m = 0;  m < messageContent[j].cards.length; m++) {
            buttons = buttons.concat(messageContent[j].cards[m].buttons)
          }
        } else if (messageContent[j].buttons) {
          buttons = messageContent[j].buttons
        }
        for (let k = 0; k < buttons.length; k++) {
          if (!buttons[k].type) {
            this.msg.error('One or more buttons have no action')
            return true
          }
        }
      }
    }
    return false
  }

  handleUserInput () {
    //debugger;

    let userInputComponents = []
    let linkedMessages = JSON.parse(JSON.stringify(this.state.linkedMessages))
    for (let x = 0; x < linkedMessages.length; x++) {
      let message = linkedMessages[x].messageContent
      for (let y = 0; y < message.length; y++) {
        let component = message[y]
        if (component.componentType === 'userInput') {
          let temp = {}
          for (let i = 0; i < component.questions.length; i++) {
            temp = {...component, ...component.questions[i]}
            delete temp.questions
            for (let j = 0; j < component.action.mapping.length; j++) {
              let mapping = component.action.mapping[j]
              temp.action = {}
              temp.action.type = component.action.type
              if (component.action.type === 'custom_fields') {
                temp.action.customFieldId = mapping.customFieldId
              } else if (component.action.type === 'google_sheets'){
                temp.action.googleSheetColumn = mapping.googleSheetColumn
              } else if (component.action.type === 'hubspot'){
                temp.action.hubspotColumn = mapping.hubspotColumn
              }
            } 
            userInputComponents.push(temp)
            linkedMessages[x].messageContent.push(temp)
            linkedMessages[x].messageContent.splice(y, 1)
          }
        }
      }
    }
    this.setState({linkedMessages})
    console.log('handleUserInput userInputComponents', userInputComponents)
  }

  testConvo () {
    if (this.state.locationPages.length > 1 || this.state.locationPages.length === 0) {
      this.msg.error('Only one page should be selected to test the broadcast')
    } else {
      let pageSelected = this.state.locationPages[0]
      if (this.props.adminPageSubscription && this.props.adminPageSubscription.length > 0) {
        var check = this.props.adminPageSubscription.filter((obj) => { return obj.pageId === pageSelected })
        if (check.length <= 0) {
          if(this.props.fbAppId && this.props.fbAppId !== '') {
            this.refs.messengerModal.click()
          }
          return
        }
      } else {
        if(this.props.fbAppId && this.props.fbAppId !== '') {
          this.refs.messengerModal.click()
        }
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
        payload: this.state.linkedMessages[0].messageContent,
        title: this.state.linkedMessages[0].title,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.locationPages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags: tagIDs,
        segmentationTimeZone: '',
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
        messageType: this.state.messageType,
        linkedMessages: this.state.linkedMessages.slice(1, this.state.linkedMessages.length)
      }
      for (let i = 0; i < data.payload.length; i++) {
        if (data.payload[i].componentType === 'list') {
          for (let j = 0; j < data.payload[i].listItems.length; j++) {
            if (data.payload[i].listItems[j].id) {
              delete data.payload[i].listItems[j].id
            }
          }
        }
      }
      this.props.sendBroadcast(data, this.msg)
    }
  }

  render () {
    console.log('pageid', this.state.pageId.pageId)
    console.log('state in create convo', this.state)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    // const { disabled, stayOpen } = this.state

    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
       <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <a href='#/' style={{ display: 'none' }} ref='reconnect' data-toggle="modal" data-target="#reconnect">reconnect</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="reconnect" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5>Error:</h5>
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>{this.state.invalidSessionMessage}</p>
                <br />
                <p>You need to reconnect your Facebook account to send this broadcast.</p>
                <a
                  href='/auth/facebook/'
                  className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'
                  data-dismiss='modal'>
                  <span>
                    <i className='la la-power-off' />
                    <span>Connect with Facebook</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="messageTypes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Message Types
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p> Following are the types of messages that can be sent to facebook messenger.</p>
              <div className='panel-group accordion' id='accordion1'>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                      <a href='https://kibopush.com/subscription-messaging/' target='_blank' rel='noopener noreferrer'>link.</a></p>
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      Promotional messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        <a href='#/' style={{ display: 'none' }} ref='messengerModal' data-toggle="modal" data-target="#messengerModal">messengerModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="messengerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Connect to Messenger:
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <MessengerPlugin
                  appId={this.props.fbAppId}
                  pageId={this.state.pageId.pageId}
                  size='large'
                  passthroughParams={`${this.props.user._id}__kibopush_test_broadcast_`}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{margin: '15px 30px 0px 30px'}} className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible' role='alert'>
          <div className='m-alert__icon'>
            <i className='flaticon-exclamation m--font-brand' />
          </div>
          <div className='m-alert__text'>
            Need help in understanding how to create broadcasts? Here is the <a href={`http://kibopush.com/${this.state.builderValue === 'basic' ? 'broadcasts' : 'flow-builder'}/`} target='_blank' rel='noopener noreferrer'>documentation</a>.
            <br />
            {
              /*
              View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}}  data-toggle="modal" data-target="#messageTypes">Message Types</Link>
              &ensp; and <a href='https://kibopush.com/2019/05/15/aspect-ratio-of-images/' target='_blank' rel='noopener noreferrer'>image guidelines</a>
              */
            }
            View Facebook guidelines regarding aspect ratio of images here: <a href='https://kibopush.com/2019/05/15/aspect-ratio-of-images/' target='_blank' rel='noopener noreferrer'>image guidelines</a>
          </div>
        </div>
        <div className="m-subheader ">
					<div className="d-flex align-items-center">
						<div className="mr-auto">
							<h3 className="m-subheader__title ">
								Create Broadcast
							</h3>
						</div>
            {
              this.state.tabActive === 'broadcast' &&
              <div className='pull-right'>
                <button className='btn btn-primary' disabled={(this.state.linkedMessages && this.state.linkedMessages[0].messageContent.length === 0) ? true : null} style={{marginRight: '10px'}} onClick={this.reset}>
                  Reset
                </button>
                <button style={{marginRight: '10px'}} className='btn btn-primary' disabled={this.isBroadcastInvalid()} onClick={this.onNext}>
                  Next
                </button>
              </div>
            }
            {
              this.state.tabActive === 'target' &&
              <div className='pull-right'>
                <button id='previous-prev' className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                  Previous
                </button>
                <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.pageValue === '' || (this.state.linkedMessages && this.state.linkedMessages[0].length === 0)) ? true : null} onClick={this.testConvo}>
                  Test
                </button>
                <button style={{marginRight: '10px'}} id='send' disabled={this.state.subscriberCount === 0 ? true : false} onClick={this.sendConvo} className='btn btn-primary'>
                  Send
                </button>
              </div>
            }
            <div style={{display: this.state.tabActive !== 'broadcast' && 'none'}} id='builder-dropdown'>
							<span onClick={this.toggleBuilderDropdown} className="m-subheader__daterange" id="m_dashboard_daterangepicker">
								<span className="m-subheader__daterange-label">
									<span className="m-subheader__daterange-date m--font-brand">
                    {this.state.builderValue === 'basic' ? 'Basic Builder' : 'Flow Builder'}
                  </span>
								</span>
								<a href="#/" className="btn btn-sm btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill">
									<i className="la la-angle-down"></i>
								</a>
							</span>
						</div>
            <div id='builder-dropdown-area'>
              {
                this.state.showBuilderDropdown &&
                <div className="daterangepicker dropdown-menu ltr opensleft" style={{display: 'block', top: '250px', right: '30.0002px', left: 'auto'}}>
                  <div className="ranges">
                    <ul>
                      <li onClick={() => this.switchBuilder('basic')} data-range-key="basic">Basic Builder</li>
                      <li onClick={() => this.switchBuilder('flow')} data-range-key="flow">Flow Builder</li>
                    </ul>
                  </div>
                </div>
              }
            </div>
					</div>
				</div>
        <BUILDER
          titleEditable
          module='broadcast'
          rerenderFlowBuilder={this.rerenderFlowBuilder}
          convoTitle={this.state.convoTitle}
          handleChange={this.handleChange}
          setReset={reset => { this.reset = reset }}
          broadcast={this.state.broadcast}
          pageId={this.state.pageId}
          buttonActions={this.state.buttonActions}
          builderValue={this.state.builderValue}
          pages={this.props.location.state && this.state.locationPages}
          handleTargetValue={this.handleTargetValue}
          subscriberCount={this.state.subscriberCount}
          totalSubscribersCount={this.state.totalSubscribersCount}
          resetTarget={this.state.resetTarget}
          linkedMessages={this.state.linkedMessages}
          showTabs={this.state.tabActive === 'broadcast'}
          unlinkedMessages={this.state.unlinkedMessages}
          switchBuilder={this.switchBuilder}
          componentLimit={3}
          reset={this.reset}
          onNext={this.onNext}
          isBroadcastInvalid={this.isBroadcastInvalid}
        />
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
    fbAppId: state.basicInfo.fbAppId,
    adminPageSubscription: state.basicInfo.adminPageSubscription,
    subscribersCount: (state.subscribersInfo.subscribersCount),
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      removePage: removePage,
      addPages: addPages,
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      getFbAppId: getFbAppId,
      getAdminSubscriptions: getAdminSubscriptions,
      loadTags: loadTags,
      loadSubscribersCount: loadSubscribersCount,
      getSubscriberCount: getSubscriberCount
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
