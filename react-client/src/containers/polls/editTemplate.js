/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { loadPollDetails } from '../../redux/actions/templates.actions'
import { addPoll, sendpoll, sendPollDirectly } from '../../redux/actions/poll.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { Link } from 'react-router-dom'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { checkConditions } from './utility'
import AlertContainer from 'react-alert'
import {loadTags} from '../../redux/actions/tags.actions'
import Targeting from '../convo/Targeting'

class EditPoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    if (this.props.currentPoll) {
      const id = this.props.currentPoll._id
      props.loadPollDetails(id)
      props.loadTags()
    }
    this.state = {
      stayOpen: false,
      disabled: false,
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: '',
      title: '',
      isList: false,
      isShowingModal: false,
      lists: [],
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      pollValue: [],
      resetTarget: false,
      isShowingModalGuideLines: false
    }
    this.createPoll = this.createPoll.bind(this)
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.goToSend = this.goToSend.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
  }
  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Edit Template`;
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.pollDetails) {
      this.setState({title: nextprops.pollDetails.title, statement: nextprops.pollDetails.statement, option1: nextprops.pollDetails.options[0], option2: nextprops.pollDetails.options[1], option3: nextprops.pollDetails.options[2], categoryValue: nextprops.pollDetails.category})
    }
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }
  closeDialog () {
    this.setState({isShowingModal: false})
  }
  handleTargetValue (targeting) {
    this.setState({
      listSelected: targeting.listSelected,
      pageValue: targeting.pageValue,
      genderValue: targeting.genderValue,
      localeValue: targeting.localeValue,
      tagValue: targeting.tagValue,
      pollValue: targeting.pollValue
    })
  }
  createPoll () {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.title === '' || this.state.categoryValue.length === 0 || this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
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
                    this.state.localeValue.length > 0 || this.state.pollValue.length > 0 || this.state.tagValue.length > 0) {
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
        isList: isListValue,
        segmentationTags: tagIDs,
        segmentationPoll: this.state.pollValue,
        segmentationList: this.state.listSelected,
        fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
      }
      console.log('Adding Poll', data)
      this.props.addPoll('', data)
    }
  }

  updateStatment (e) {
    this.setState({statement: e.target.value})
  }
  updateTitle (e) {
    this.setState({title: e.target.value})
  }
  updateOptions (e, opt) {
    switch (opt) {
      case 1:
        this.setState({option1: e.target.value})
        break
      case 2:
        this.setState({option2: e.target.value})
        break
      case 3:
        this.setState({option3: e.target.value})
        break

      default:
        break
    }
  }

  goToSend () {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
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
        console.log('Sending Poll', data)
        this.props.sendPollDirectly(data, this.msg)
      }
    }
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {/*
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
        */}
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Create Template Poll</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
              <div className='m-portlet' style={{height: '100%'}}>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                      Ask Facebook Subscribers a Question
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      {/*
                        this.state.isShowingModal &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <p>Do you want to send this poll right away or save it for later use? </p>
                            <div style={{width: '100%', textAlign: 'center'}}>
                              <div style={{display: 'inline-block', padding: '5px'}}>
                                <button className='btn btn-primary' onClick={() => {
                                  this.closeDialog()
                                  this.goToSend()
                                }}>
                                  Send
                                </button>
                              </div>
                              <div style={{display: 'inline-block', padding: '5px'}}>
                                <button className='btn btn-primary' onClick={() => {
                                  this.createPoll()
                                  this.props.history.push({
                                    pathname: '/poll'
                                  })
                                }}>
                                  Save
                                </button>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      */}
                    </div>
                  </div>
                  <div className='m-form'>
                    <div id='question' className='form-group m-form__group'>
                      <label className='control-label'>Ask something...</label>
                      <textarea className='form-control'
                        value={this.state.statement}
                        onChange={(e) => this.updateStatment(e)} />
                    </div>
                    <div style={{top: '10px'}}>
                      <label className='control-label'> Add 3 responses</label>
                      <fieldset className='input-group-vertical'>
                        <div id='responses' className='form-group m-form__group'>
                          <label className='sr-only'>Response1</label>
                          <input type='text' className='form-control'
                            value={this.state.option1}
                            onChange={(e) => this.updateOptions(e, 1)}
                            placeholder='Response 1' maxLength='20' />
                        </div>
                        <div className='form-group m-form__group'>
                          <label className='sr-only'>Response2</label>
                          <input type='text' className='form-control'
                            value={this.state.option2}
                            onChange={(e) => this.updateOptions(e, 2)}
                            placeholder='Response 2' maxLength='20' />
                        </div>
                        <div className='form-group m-form__group'>
                          <label className='sr-only'>Response3</label>
                          <input type='text' className='form-control'
                            value={this.state.option3}
                            onChange={(e) => this.updateOptions(e, 3)}
                            placeholder='Response 3' maxLength='20' />
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  { this.state.alert &&
                    <center>
                      <Alert type='danger' style={{marginTop: '30px'}}>
                        You have either left one or more responses empty or you
                        have not asked anything. Please ask something and fill all
                        three responses in order to create the poll.
                      </Alert>
                    </center>
                  }
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='col-12'>
                    <p style={{marginTop: '10px'}}> <b>Note: </b>On sending, subscribers who are engaged in live chat with an agent, will receive this poll after 30 mins of ending the conversation.</p>
                  </div>
                  <div className='col-12'>
                    <div className='m-form__actions' style={{'float': 'right', 'marginRight': '20px'}}>
                      <button className='btn btn-primary'
                        onClick={this.showDialog}> Save
                      </button>
                      <Link
                        to='/showTemplatePolls'
                        className='btn btn-secondary' style={{'margin-left': '10px'}}>
                        Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <div className='m-portlet' style={{height: '100%'}}>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                      Targeting
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <Targeting handleTargetValue={this.handleTargetValue} resetTarget={this.state.resetTarget} component='poll' />
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
    pages: (state.pagesInfo.pages),
    polls: (state.pollsInfo.polls),
    user: (state.basicInfo.user),
    pollDetails: (state.templatesInfo.pollDetails),
    currentPoll: (state.backdoorInfo.currentPoll),
    subscribers: (state.subscribersInfo.subscribers),
    tags: (state.tagsInfo.tags),
    allResponses: (state.pollsInfo.allResponses)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    addPoll: addPoll,
    loadPollDetails: loadPollDetails,
    getuserdetails: getuserdetails,
    sendpoll: sendpoll,
    loadSubscribersList: loadSubscribersList,
    sendPollDirectly: sendPollDirectly,
    loadTags: loadTags
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditPoll)
