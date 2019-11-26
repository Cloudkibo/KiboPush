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
  sendBroadcast,
  getSubscriberCount
} from '../../redux/actions/broadcast.actions'
import { loadSubscribersCount } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
import { Link } from 'react-router-dom'
// import { checkConditions } from '../polls/utility'
import { validateFields } from './utility'
import Targeting from './Targeting'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
// import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import {loadTags} from '../../redux/actions/tags.actions'
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'

var MessengerPlugin = require('react-messenger-plugin').default

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview', 'unsubscribe sequence', 'subscribe sequence', 'set custom field'],
      broadcast: this.props.location.state && this.props.location.state.payload ? this.props.location.state.payload : [],
      stayOpen: false,
      disabled: false,
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
      locationPages: this.props.location.state ? this.props.location.state.pages : []
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
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.loadsdk = this.loadsdk.bind(this)
    this.handleSubscriberCount = this.handleSubscriberCount.bind(this)
  }

  handleChange (state) {
    this.setState(state)
  }

  onNext (e) {
    console.log('in onNext', this.state.broadcast)
    if (validateFields(this.state.broadcast, this.msg)) {
      /* eslint-disable */
        $('#tab_1').removeClass('active')
        $('#tab_2').addClass('active')
        $('#titleBroadcast').removeClass('active')
        $('#titleTarget').addClass('active')
        /* eslint-enable */
      this.setState({tabActive: 'target'})
      const payload = {
        pageId: this.state.pageId._id,
        segmented: false,
        isList: false,
      }
      this.props.getSubscriberCount(payload, this.handleSubscriberCount)
    }
  }

  handleSubscriberCount(response) {
    this.setState({subscriberCount: response.payload.count})
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
  onBroadcastClick () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onTargetClick (e) {
    if (validateFields(this.state.broadcast, this.msg)) {
      /* eslint-disable */
        $('#tab_1').removeClass('active')
        $('#tab_2').addClass('active')
        $('#titleBroadcast').removeClass('active')
        $('#titleTarget').addClass('active')
        /* eslint-enable */
      this.setState({tabActive: 'target', resetTarget: false})

      const payload = {
        pageId: this.state.pageId._id,
        segmented: false,
        isList: false,
      }
      this.props.getSubscriberCount(payload, this.handleSubscriberCount)
    }
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
    console.log('in sendConvo', this.state.broadcast)
    //  this.setState({tabActive: 'broadcast'})
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
      console.log('payload before', this.state.broadcast)
      var data = {
        platform: 'facebook',
        payload: this.state.broadcast,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.locationPages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags:  this.state.tagValue,
        segmentationTimeZone: '',
        title: this.state.convoTitle,
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
        subscribersCount: this.state.subscriberCount,
        messageType: this.state.messageType
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
        segmentationPageIds: this.state.locationPages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags: tagIDs,
        segmentationTimeZone: '',
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
        messageType: this.state.messageType
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
    console.log('appid',this.props.fbAppId)
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
        <SubscriptionPermissionALert />
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
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding how to create broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              <br />
              View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}}  data-toggle="modal" data-target="#messageTypes">Message Types</Link>

              &ensp; and <a href='https://kibopush.com/2019/05/15/aspect-ratio-of-images/' target='_blank' rel='noopener noreferrer'>image guidelines</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Create Broadcast
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      {
                        this.state.tabActive === 'broadcast' &&
                        <div className='pull-right'>
                          <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} style={{marginRight: '10px'}} onClick={this.reset}>
                            Reset
                          </button>
                          <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.onNext}>
                            Next
                          </button>
                        </div>
                      }
                      {
                        this.state.tabActive === 'target' &&
                        <div className='pull-right'>
                          <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                            Previous
                          </button>
                          <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.pageValue === '' || (this.state.broadcast.length === 0))} onClick={this.testConvo}>
                            Test
                          </button>
                          <button id='send' disabled={this.state.subscriberCount === 0 ? true : false} onClick={this.sendConvo} className='btn btn-primary'>
                            Send
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                      <ul className='nav nav-tabs'>
                        <li>
                          <a href='#/' id='titleBroadcast' className='broadcastTabs active' onClick={this.onBroadcastClick}>Broadcast </a>
                        </li>
                        <li>
                          {this.state.broadcast.length > 0
                            ? <a href='#/' id='titleTarget' className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                            : <a href='#/'>Targeting</a>
                          }
                        </li>

                      </ul>
                      <div className='tab-content'>
                        <div className='tab-pane fade active in' id='tab_1'>
                          <GenericMessage
                            module = {this.props.location.state.module}
                            broadcast={this.state.broadcast}
                            handleChange={this.handleChange}
                            setReset={reset => { this.reset = reset }}
                            convoTitle={this.state.convoTitle}
                            titleEditable
                            pageId={this.state.pageId.pageId}
                            pages={this.props.location.state && this.state.locationPages}
                            buttonActions={this.state.buttonActions} />
                        </div>
                        <div className='tab-pane' id='tab_2'>
                          <Targeting handleTargetValue={this.handleTargetValue} subscriberCount={this.state.subscriberCount} resetTarget={this.state.resetTarget} page={this.state.pageId} component='broadcast' />
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
    fbAppId: state.basicInfo.fbAppId,
    adminPageSubscription: state.basicInfo.adminPageSubscription,
    subscribersCount: (state.subscribersInfo.subscribersCount),
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
