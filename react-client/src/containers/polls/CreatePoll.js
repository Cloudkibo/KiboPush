/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import { connect } from 'react-redux'
import { loadPollDetails } from '../../redux/actions/templates.actions'
import { addPoll, loadPollsList, sendpoll, sendPollDirectly } from '../../redux/actions/poll.actions'
import { saveCurrentPoll } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { checkConditions } from './utility'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { doesPageHaveSubscribers } from '../../utility/utils'
import Targeting from '../convo/Targeting'
import SequencePopover from '../../components/Sequence/sequencePopover'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import {
  getSubscriberCount
} from '../../redux/actions/broadcast.actions'

class CreatePoll extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
    props.fetchAllSequence()
    props.loadSubscribersList()
    props.loadTags()
    this.state = {
      stayOpen: false,
      disabled: false,
      alert: false,
      statement: this.props.currentPoll ? this.props.currentPoll.statement : '',
      option1: { option: this.props.currentPoll ? this.props.currentPoll.options[0].option : '', sequenceId: this.props.currentPoll ? this.props.currentPoll.options[0].sequenceId : '', action: this.props.currentPoll ? this.props.currentPoll.options[0].action : '' },
      option2: { option: this.props.currentPoll ? this.props.currentPoll.options[1].option : '', sequenceId: this.props.currentPoll ? this.props.currentPoll.options[1].sequenceId : '', action: this.props.currentPoll ? this.props.currentPoll.options[1].action : '' },
      option3: { option: this.props.currentPoll ? this.props.currentPoll.options[2].option : '', sequenceId: this.props.currentPoll ? this.props.currentPoll.options[2].sequenceId : '', action: this.props.currentPoll ? this.props.currentPoll.options[2].action : '' },
      listSelected: '',
      isList: false,
      lists: [],
      resetTarget: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      pollValue: [],
      isShowingModalGuideLines: false,
      pageId: this.props.pages[0],
      tabActive: 'poll',
      subscriberCount: 0,
      totalSubscribersCount: 0,
      isApprovedForSMP: false
    }
    this.handleSubscriberCount = this.handleSubscriberCount.bind(this)
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
    this.goToSend = this.goToSend.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.checkValidation = this.checkValidation.bind(this)
    this.showError = this.showError.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onPollClick = this.onPollClick.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.updateOptionsActions = this.updateOptionsActions.bind(this)
  }
  handleSubscriberCount(response) {
    this.setState({
      subscriberCount: response.payload.count,
      totalSubscribersCount: response.payload.totalCount,
      isApprovedForSMP: response.payload.isApprovedForSMP
    })
  }
  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  onNext(e) {
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

  onPrevious() {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({ tabActive: 'poll' })
  }

  initTab() {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({ tabActive: 'poll' })
  }

  onPollClick() {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({ tabActive: 'poll' })
  }
  onTargetClick(e) {
    /* eslint-disable */
    $('#tab_1').removeClass('active')
    $('#tab_2').addClass('active')
    $('#titleBroadcast').removeClass('active')
    $('#titleTarget').addClass('active')
    /* eslint-enable */
    this.setState({ tabActive: 'target', resetTarget: false })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextprops.pollDetails', nextProps.pollDetails)
    if (nextProps.warning) {
      this.msg.error(nextProps.warning)
    } else if (nextProps.pollCreated) {
      this.props.history.push({
        pathname: '/poll'
      })
    }
    if (nextProps.pollDetails) {
      let option1 = { option: nextProps.pollDetails.options[0], sequenceId: '', action: '' }
      let option2 = { option: nextProps.pollDetails.options[1], sequenceId: '', action: '' }
      let option3 = { option: nextProps.pollDetails.options[2], sequenceId: '', action: '' }
      this.setState({ title: nextProps.pollDetails.title, statement: nextProps.pollDetails.statement, option1: option1, option2: option2, option3: option3, categoryValue: nextProps.pollDetails.category })
    }
  }

  closeGuideLinesDialog() {
    this.setState({ isShowingModalGuideLines: false })
  }
  componentDidMount() {
    if (this.props.currentPoll) {
      const id = this.props.currentPoll._id
      this.props.loadPollDetails(id)
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Poll`
    this.initTab()
    this.props.saveCurrentPoll(undefined)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  handleTargetValue (targeting) {
    //console.log('targeting createPoll', targeting)
    //console.log('pageId', this.props.pages.find(page => page.pageId === targeting.pageValue[0]))
    let pageId = this.props.pages.find(page => page.pageId === targeting.pageValue[0])
    this.setState({
      listSelected: targeting.listSelected,
      pageValue: targeting.pageValue,
      pageId: pageId,
      genderValue: targeting.genderValue,
      localeValue: targeting.localeValue,
      tagValue: targeting.tagValue,
      pollValue: targeting.pollValue
    })
    var payload = {
      pageId:  pageId._id,
      pageAccessToken: pageId.accessToken,
      segmented: true,
      segmentationGender: targeting.genderValue,
      segmentationLocale: targeting.localeValue,
      segmentationTags: targeting.tagValue,
      isList: targeting.isList ? true : false,
      segmentationList: targeting.listSelected,
      segmentationPoll: targeting.pollValue
  }
  this.props.getSubscriberCount(payload, this.handleSubscriberCount)
  }

  checkValidation() {
    if (this.state.option1.option === '' || this.state.option2.option === '' ||
      this.state.option3.option === '' || this.state.statement === '') {
      console.log('vald' + this.state.option1 + ' ' + this.state.option2 + ' ' + this.state.option3 + ' ' + this.state.statement)
      this.setState({ alert: true })
    } else {
      this.refs.send.click()
    }
  }

  showError() {
    this.setState({ alert: true })
  }

  createPoll() {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.option1.option === '' || this.state.option2.option === '' ||
      this.state.option3.option === '' || this.state.statement === '') {
      this.setState({ alert: true })
    } else {
      if (this.state.option1.option !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2.option !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3.option !== '') {
        options.push(this.state.option3)
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
        this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.pollValue.length > 0) {
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
        platform: 'Facebook',
        datetime: Date.now(),
        statement: this.state.statement,
        sent: 0,
        options: options,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.pageValue,
        segmentationGender: this.state.genderValue,
        segmentationLocale: this.state.localeValue,
        segmentationTags: tagIDs,
        segmentationPoll: this.state.pollValue,
        isList: isListValue,
        segmentationList: this.state.listSelected,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
      }
      console.log('Adding Poll', data)
      this.props.addPoll('', data, (res) => {
        if (res.status === 'success') {
          this.props.history.push({
            pathname: '/poll'
          })
        } else {
          this.msg.error(res.description || 'Failed to save poll')
        }
      })
    }
  }

  updateStatment(e) {
    this.setState({ statement: e.target.value, alert: false })
  }

  updateOptions(e, opt) {
    switch (opt) {
      case 1:
        let optionTmp = this.state.option1
        optionTmp.option = e.target.value
        this.setState({ option1: optionTmp, alert: false })
        break
      case 2:
        let optionTmp2 = this.state.option2
        optionTmp2.option = e.target.value
        this.setState({ option2: optionTmp2, alert: false })
        break
      case 3:
        let optionTmp3 = this.state.option3
        optionTmp3.option = e.target.value
        this.setState({ option3: optionTmp3, alert: false })
        break

      default:
        break
    }
  }

  updateOptionsActions(sequenceId, action, opt) {
    switch (opt) {
      case 1:
        let optionTmp = this.state.option1
        optionTmp.sequenceId = sequenceId
        optionTmp.action = action
        this.setState({ option1: optionTmp, alert: false })
        break
      case 2:
        let optionTmp2 = this.state.option2
        optionTmp2.sequenceId = sequenceId
        optionTmp2.action = action
        this.setState({ option2: optionTmp2, alert: false })
        break
      case 3:
        let optionTmp3 = this.state.option3
        optionTmp3.sequenceId = sequenceId
        optionTmp3.action = action
        this.setState({ option3: optionTmp3, alert: false })
        break

      default:
        break
    }
  }

  goToSend() {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.option1.option === '' || this.state.option2.option === '' ||
      this.state.option3.option === '' || this.state.statement === '') {
      this.setState({ alert: true })
    } else {
      if (this.state.option1 !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2 !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3 !== '') {
        options.push(this.state.option3)
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
        this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.pollValue.length > 0) {
        isSegmentedValue = true
      }
      let polls = {
        selectedPolls: this.state.pollValue,
        pollResponses: this.props.allResponses
      }
      var res = checkConditions(this.state.pageValue, this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers, polls)
      if (res === false) {
        this.msg.error('No subscribers match the selected criteria')
      } else {
        // for (let i = 0; i < this.props.tags.length; i++) {
        //   for (let j = 0; j < this.state.tagValue.length; j++) {
        //     if (this.props.tags[i].tag === this.state.tagValue[j]) {
        //       tagIDs.push(this.props.tags[i]._id)
        //     }
        //   }
        // }
        let currentPageSubscribers
        if (this.state.pageId) {
          currentPageSubscribers = this.props.subscribers.filter(subscriber => subscriber.pageId.pageId === this.state.pageId.pageId)
        } else {
          currentPageSubscribers = this.props.subscribers
        }

        var data = {
          platform: 'Facebook',
          datetime: Date.now(),
          statement: this.state.statement,
          sent: 0,
          options: options,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationGender: this.state.genderValue,
          segmentationLocale: this.state.localeValue,
          segmentationTags: this.state.tagValue,
          isList: isListValue,
          segmentationPoll: this.state.pollValue,
          segmentationList: this.state.listSelected,
          fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
          subscribersCount: currentPageSubscribers.length,
          isApprovedForSMP: this.state.isApprovedForSMP
        }
        console.log('Sending Poll', data)
        this.props.sendPollDirectly(data, this.msg)
      }
    }
  }

  render() {
    // const { disabled, stayOpen } = this.state
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='send' data-toggle="modal" data-target="#send">send</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="send" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Send Poll
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Do you want to send this poll right away or save it for later use? </p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={() => {
                      this.closeDialog()
                      this.goToSend()
                    }} disabled={this.state.subscriberCount === 0 ? true : null} data-dismiss='modal'>
                      Send
                    </button>
                  </div>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={() => {
                      this.createPoll()
                    }}
                    data-dismiss='modal'>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="guideline" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <div style={{ color: 'black' }} className="modal-body">
                <p> Following are the types of messages that can be sent to facebook messenger.</p>
                <div className='panel-group accordion' id='accordion1'>
                  <div className='panel panel-default'>
                    <div className='panel-heading guidelines-heading'>
                      <h4 className='panel-title'>
                        <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                      </h4>
                    </div>
                    <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                      <div className='panel-body'>
                        <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                        <a href='https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions' target='_blank' rel='noopener noreferrer'>link.</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='panel panel-default'>
                    <div className='panel-heading guidelines-heading'>
                      <h4 className='panel-title'>
                        <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                      </h4>
                    </div>
                    <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
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
                    <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
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
        <div className='m-content'>
          {
            /*
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-brand' />
              </div>
              <div className='m-alert__text'>
                View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{ color: '#5867dd', cursor: 'pointer' }} data-toggle="modal" data-target="#guideline">Message Types</Link>
              </div>
            </div>
            */
          }
          <div className='row'>
            <div className='col-12'>
              <div className='m-portlet' style={{ height: '100%' }}>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Ask Facebook Subscribers a Question
                        </h3>
                    </div>
                  </div>
                </div>

                <div className='m-portlet__body' >
                  {
                    this.state.tabActive === 'target' &&
                    <div className='row'>
                      <div className='col-12'>
                        <div className='pull-right'>
                          <button className='btn btn-primary' style={{ marginRight: '10px' }} onClick={this.onPrevious}>
                            Previous
                            </button>

                          <button
                            disabled={!doesPageHaveSubscribers(this.props.pages, this.state.pageValue) ? true : null}
                            className='btn btn-primary'
                            onClick={() => {
                              this.checkValidation()
                            }}>
                            Create Poll
                            </button>

                        </div>
                      </div>
                    </div>
                  }

                  {
                    this.state.tabActive === 'poll' &&
                    <div className='row'>
                      <div className='col-12'>
                        <div className='pull-right'>
                          <button className='btn btn-primary'
                            style={{ marginRight: '10px' }}
                            disabled={(this.state.option1.option === '' || this.state.option2.option === '' || this.state.option3.option === '' || this.state.statement === '')}
                            onClick={this.onNext}>
                            Next
                            </button>
                          <Link
                            to='/poll'
                            className='btn btn-secondary' style={{ 'marginLeft': '10px' }}>
                            Cancel
                          </Link>
                        </div>
                      </div>
                    </div>
                  }

                  <div className='row'>
                    <div className='col-12'>
                      <ul className='nav nav-tabs'>
                        <li>
                          <a id='titleBroadcast' className='broadcastTabs active' onClick={this.onPollClick} href='#/'>Poll </a>
                        </li>
                        <li>
                          {
                            (this.state.option1 === '' || this.state.option2 === '' || this.state.option3 === '' || this.state.statement === '')
                              ? <a href='#/'>Targeting</a>
                              : <a id='titleTarget' className='broadcastTabs' onClick={this.onTargetClick} href='#/'>Targeting </a>
                          }
                        </li>
                      </ul>
                      <div className='tab-content'>
                        <div className='tab-pane fade active in' id='tab_1'>
                          <div className='row align-items-center'>
                            <div className='col-xl-8 order-2 order-xl-1' />
                            <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                            </div>
                          </div>
                          <div className='m-form'>
                            <div id='question' className='form-group m-form__group'>
                              <label className='control-label'>Ask something...</label>
                              <textarea className='form-control'
                                value={this.state.statement}
                                placeholder='Enter Question'
                                onChange={(e) => this.updateStatment(e)} />
                            </div>
                            <div style={{ top: '10px' }}>
                              <label className='control-label'> Add 3 responses</label>
                              <fieldset className='input-group-vertical'>
                                <div className='row'>
                                  <div id='responses' className='form-group m-form__group col-xl-10'>
                                    <label className='sr-only'>Response1</label>
                                    <input type='text' className='form-control'
                                      value={this.state.option1.option}
                                      onChange={(e) => this.updateOptions(e, 1)}
                                      placeholder='Response 1' maxLength='20' />
                                  </div>
                                  {
                                    this.props.sequences &&
                                    <div className='col-xl-2'>
                                      <SequencePopover
                                        optionNumber={1}
                                        sequences={this.props.sequences}
                                        onSave={this.updateOptionsActions}
                                      />
                                    </div>
                                  }
                                </div>
                                <div className='row'>
                                  <div className='form-group m-form__group col-xl-10'>
                                    <label className='sr-only'>Response2</label>
                                    <input type='text' className='form-control'
                                      value={this.state.option2.option}
                                      onChange={(e) => this.updateOptions(e, 2)}
                                      placeholder='Response 2' maxLength='20' />
                                  </div>
                                  {
                                    this.props.sequences &&
                                    <div className='col-xl-2'>
                                      <SequencePopover
                                        optionNumber={2}
                                        sequences={this.props.sequences}
                                        onSave={this.updateOptionsActions}
                                      />
                                    </div>
                                  }
                                </div>
                                <div className='row'>
                                  <div className='form-group m-form__group col-xl-10'>
                                    <label className='sr-only'>Response3</label>
                                    <input type='text' className='form-control'
                                      value={this.state.option3.option}
                                      onChange={(e) => this.updateOptions(e, 3)}
                                      placeholder='Response 3' maxLength='20' />
                                  </div>
                                  {
                                    this.props.sequences &&
                                    <div className='col-xl-2'>
                                      <SequencePopover
                                        optionNumber={3}
                                        sequences={this.props.sequences}
                                        onSave={this.updateOptionsActions}
                                      />
                                    </div>
                                  }
                                </div>
                              </fieldset>
                            </div>
                          </div>
                          {this.state.alert &&
                            <center>
                              <Alert type='danger' style={{ marginTop: '30px' }}>
                                You have either left one or more responses empty or you
                                have not asked anything. Please ask something and fill all
                                three responses in order to create the poll.
                                </Alert>
                            </center>
                          }
                        </div>
                        <div className='tab-pane' id='tab_2'>
                          <Targeting
                            handleTargetValue={this.handleTargetValue}
                            subscriberCount = {this.state.subscriberCount}
                            totalSubscribersCount={this.state.totalSubscribersCount}
                            resetTarget={this.state.resetTarget}
                            subscribers={this.props.subscribers}
                            page={this.state.pageId}
                            component='poll'
                          />
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

function mapStateToProps(state) {
  console.log('CreatePoll state', state)
  return {
    pollCreated: (state.pollsInfo.pollCreated),
    warning: (state.pollsInfo.warning),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    subscribers: (state.subscribersInfo.subscribers),
    tags: (state.tagsInfo.tags),
    polls: (state.pollsInfo.polls),
    pollDetails: (state.templatesInfo.pollDetails),
    currentPoll: (state.backdoorInfo.currentPoll),
    allResponses: (state.pollsInfo.allResponses),
    sequences: (state.sequenceInfo.sequences),
    subscribersCount: (state.subscribersInfo.subscribersCount)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPollsList: loadPollsList,
    addPoll: addPoll,
    sendpoll: sendpoll,
    loadSubscribersList: loadSubscribersList,
    sendPollDirectly: sendPollDirectly,
    loadTags: loadTags,
    loadPollDetails: loadPollDetails,
    saveCurrentPoll:saveCurrentPoll,
    fetchAllSequence:fetchAllSequence,
    getSubscriberCount: getSubscriberCount
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
