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
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
import { Link } from 'react-router'
import { checkConditions } from '../polls/utility'
import { validateFields } from './utility'
import Targeting from './Targeting'
import GenericMessage from '../../components/GenericMessage'
// import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import {loadTags} from '../../redux/actions/tags.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      broadcast: [],
      stayOpen: false,
      disabled: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      isShowingModal: false,
      isShowingModalGuideLines: false,
      isshowGuideLinesImageDialog: false,
      isShowingModalResetAlert: false,
      convoTitle: 'Broadcast Title',
      showMessengerModal: false,
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: [],
      tabActive: 'broadcast',
      resetTarget: false,
      setTarget: false,
      showInvalidSession: false,
      invalidSessionMessage: '',
      pageId: ''
    }
    props.getuserdetails()
    props.getFbAppId()
    props.getAdminSubscriptions()
    props.loadTags()
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
    this.handleSendBroadcast = this.handleSendBroadcast.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.testConvo = this.testConvo.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.closeInvalidSession = this.closeInvalidSession.bind(this)
    this.showGuideLinesImageDialog = this.showGuideLinesImageDialog.bind(this)
    this.closeGuideLinesImageDialog = this.closeGuideLinesImageDialog.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (state) {
    this.setState(state)
  }

  onNext (e) {
    if (validateFields(this.state.broadcast, this.msg)) {
      /* eslint-disable */
        $('#tab_1').removeClass('active')
        $('#tab_2').addClass('active')
        $('#titleBroadcast').removeClass('active')
        $('#titleTarget').addClass('active')
        /* eslint-enable */
      this.setState({tabActive: 'target'})
    }
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
      tagValue: targeting.tagValue
    })
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
    }
  }

  closeInvalidSession () {
    this.setState({showInvalidSession: false})
  }

  handleSendBroadcast (res) {
    if (res.status === 'success') {
      this.initTab()
      this.reset(false)
      this.setState({resetTarget: true})
    } else if (res.status === 'INVALID_SESSION') {
      this.setState({showInvalidSession: true, invalidSessionMessage: res.description})
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
        comp.setState({showMessengerModal: false})
        comp.msg.success('Subscribed successfully. Click on the test button again to test')
      }
    })
    let pageId = this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])[0].pageId
    this.setState({
      pageId: pageId
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
    }
  }
  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  showGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: true})
  }
  closeGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: false})
  }

  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/broadcasts`

    })
  }

  sendConvo () {
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
    console.log('this.props.location.state.pages', this.props.location.state.pages)
    console.log('this.props.pages', this.props.pages)
    let pageId = this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])[0].pageId
    var res = checkConditions([pageId], this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers)
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
        segmentationPageIds: this.props.location.state.pages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags: tagIDs,
        segmentationTimeZone: '',
        title: this.state.convoTitle,
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
      }
        //  this.setState({tabActive: 'broadcast'})
      console.log('Sending Broadcast', data)
      this.props.sendBroadcast(data, this.msg, this.handleSendBroadcast)
      this.msg.info('Sending broadcast.... You will be notified when it is sent.')
    }
  }

  testConvo () {
    if (this.props.location.state.pages.length > 1 || this.props.location.state.pages.length === 0) {
      this.msg.error('Only one page should be selected to test the broadcast')
    } else {
      let pageSelected = this.props.location.state.pages[0]
      var check = this.props.adminPageSubscription.filter((obj) => { return obj.pageId === pageSelected })
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
        segmentationPageIds: this.props.location.state.pages,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTags: tagIDs,
        segmentationTimeZone: '',
        segmentationList: this.state.listSelected,
        isList: isListValue,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'

      }
      this.props.sendBroadcast(data, this.msg)
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
    // const { disabled, stayOpen } = this.state

    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showInvalidSession &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeInvalidSession}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeInvalidSession}>
              <h3>Error:</h3>
              <p>{this.state.invalidSessionMessage}</p>
              <br />
              <p>You need to reconnect your Facebook account to send this broadcast.</p>
              <a href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                <span>
                  <i className='la la-power-off' />
                  <span>Connect with Facebook</span>
                </span>
              </a>
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
                      <a href='https://kibopush.com/subscription-messaging/' target='_blank'>link.</a></p>
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
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.isshowGuideLinesImageDialog &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeGuideLinesImageDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeGuideLinesImageDialog}>
              <p>Use the correct aspect ratio for your image. Photos in the generic template that aren't <strong>1.91:1 </strong>will be scaled or cropped. </p>

            </ModalDialog>
          </ModalContainer>
        }

        {
          this.state.showMessengerModal &&
          <ModalContainer style={{width: '500px'}}
            onClick={() => { this.setState({showMessengerModal: false}) }}
            onClose={() => { this.setState({showMessengerModal: false}) }}>
            <ModalDialog style={{width: '500px'}}
              onClick={() => { this.setState({showMessengerModal: false}) }}
              onClose={() => { this.setState({showMessengerModal: false}) }}>
              <h3 onClick={() => { this.setState({showMessengerModal: false}) }} >Connect to Messenger:</h3>
              <MessengerPlugin
                appId={this.props.fbAppId}
                pageId={JSON.stringify(this.state.pageValue[0])}
                passthroughParams={this.props.user._id}
                onClick={() => { this.setState({showMessengerModal: false}) }}
              />
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding how to create broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank'>documentation</a>.
              <br />
              View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>

              &ensp; and image guidelines: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesImageDialog} >click here</Link>
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
                          <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.reset}>
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
                          <button id='send' onClick={this.sendConvo} className='btn btn-primary'>
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
                          <a id='titleBroadcast' className='broadcastTabs active' onClick={this.onBroadcastClick}>Broadcast </a>
                        </li>
                        <li>
                          {this.state.broadcast.length > 0
                            ? <a id='titleTarget' className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                            : <a>Targeting</a>
                          }
                        </li>

                      </ul>
                      <div className='tab-content'>
                        <div className='tab-pane fade active in' id='tab_1'>
                          <GenericMessage handleChange={this.handleChange} setReset={reset => { this.reset = reset }} convoTitle={this.state.convoTitle} titleEditable pages={this.props.location.state.pages} />
                        </div>
                        <div className='tab-pane' id='tab_2'>
                          <Targeting handleTargetValue={this.handleTargetValue} resetTarget={this.state.resetTarget} component='broadcast' />
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
    subscribers: (state.subscribersInfo.subscribers),
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
      loadTags: loadTags
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
