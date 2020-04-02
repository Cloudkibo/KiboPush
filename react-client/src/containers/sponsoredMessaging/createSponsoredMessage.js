/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Header from './header'
import AdAccount from './adAccount'
import Campaign from './campaign'
import StepsBar from './stepsBar'
import AdSet from './adSet'
import Ad from './ad'
import {updateSponsoredMessage, saveDraft, send } from '../../redux/actions/sponsoredMessaging.actions'
import {checkValidations } from './utility'
import {getFileIdsOfBroadcast, deleteInitialFiles} from '../../utility/utils'


class CreateSponsoredMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isEdit: false,
      editSponsoredMessage: this.props.location.state ? this.props.location.state.sponsoredMessage : {},
      sendDisabled: false,
      currentStep: props.sponsoredMessage.adSetId && props.sponsoredMessage.adSetId !== '' ? 'ad'
      : props.sponsoredMessage.campaignId && props.sponsoredMessage.campaignId !== '' ? 'adSet'
      : props.sponsoredMessage.adAccountId && props.sponsoredMessage.adAccountId !== '' ? 'campaign'
      : 'adAccount',
      loading: false,
      initialFiles: props.sponsoredMessage && props.sponsoredMessage.payload ? getFileIdsOfBroadcast(props.sponsoredMessage.payload) : []
    }
    if(this.props.location.state && this.props.location.state.module === 'edit'  && this.props.location.state.sponsoredMessage) {
      this.props.updateSponsoredMessage(this.props.location.state.sponsoredMessage)
    }
    this.onEdit = this.onEdit.bind(this)
    this.onSend = this.onSend.bind(this)
    this.changeCurrentStep = this.changeCurrentStep.bind(this)
    this.onSave = this.onSave.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.handleSaveResponse = this.handleSaveResponse.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.sponsoredMessage) {
      if (nextProps.sponsoredMessage.adSetId && nextProps.sponsoredMessage.adSetId !== '') {
        this.setState({currentStep: 'ad'})
      } else if (nextProps.sponsoredMessage.campaignId && nextProps.sponsoredMessage.campaignId !== '') {
        this.setState({currentStep: 'adSet'})
      } else if (nextProps.sponsoredMessage.adAccountId && nextProps.sponsoredMessage.adAccountId !== '') {
        this.setState({currentStep: 'campaign'})
      } else {
        this.setState({currentStep: 'adAccount'})
      }
    }
  }

  handleSaveResponse () {
    this.props.history.push({
      pathname: '/sponsoredMessaging'
    })
  }

  handleResponse (res) {
    this.setState({loading: false})
    if (res.status === 'success') {
      this.props.history.push({
        pathname: '/sponsoredMessaging'
      })
    } else {
      this.msg.error(res.payload)
    }
  }

  changeCurrentStep (value) {
    this.setState({currentStep: value})
  }

  componentDidMount () {
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      this.setState({isEdit: true})
      this.setState({editSponsoredMessage: this.props.location.state.sponsoredMessage})
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit Sponsored Message`
    } else {
      document.title = `${title} | Create Sponsored Message`
    }
  }
  onEdit () {
    let sponsoredMessage = JSON.parse(JSON.stringify(this.props.sponsoredMessage))
    if (sponsoredMessage.pageFbId) {
      delete sponsoredMessage.pageFbId
    }
    if(this.props.location.state && this.props.location.state.module === 'edit') {
      this.props.saveDraft(this.state.editSponsoredMessage._id, sponsoredMessage, this.msg)
    } else {
      this.props.saveDraft(this.props.sponsoredMessage._id, sponsoredMessage, this.msg)
    }
  }
  onSend () {
    if (checkValidations(this.props.sponsoredMessage)) {
      this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, {newFiles: []})
      this.setState({loading: true})
      let pageId = this.props.pages && this.props.pages.filter(p => p._id === this.props.sponsoredMessage.pageId)[0].pageId
      let sponsoredMessage = JSON.parse(JSON.stringify(this.props.sponsoredMessage))
      sponsoredMessage.pageFbId = pageId
      this.props.send(sponsoredMessage, this.handleResponse)
    } else {
      this.msg.error('Please complete all the steps')
    }
  }
  onSave () {
    if (checkValidations(this.props.sponsoredMessage)) {
      let initialFiles = this.state.initialFiles
      let currentFiles = getFileIdsOfBroadcast(this.props.sponsoredMessage.payload)
      deleteInitialFiles(initialFiles, currentFiles)
      this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, {newFiles: []})
      this.props.saveDraft(this.props.sponsoredMessage._id, this.props.sponsoredMessage, this.msg, this.handleSaveResponse)
    } else {
      this.msg.error('Please complete all the steps')
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <Header onSend={this.onSend}
                  onEdit={this.onEdit}
                  isEdit={this.state.isEdit}
                  sendDisabled = {this.state.sendDisabled}
                  onSave = {this.onSave}
                  loading={this.state.loading}
                />
                <div className='m-portlet__body'>
                  <StepsBar currentStep={this.state.currentStep}
                    sponsoredMessage={this.props.sponsoredMessage}
                    changeCurrentStep={this.changeCurrentStep} />
                  <br /><br /><br />
                  {this.state.currentStep === 'adAccount' &&
                    <AdAccount changeCurrentStep={this.changeCurrentStep} msg={this.msg} />
                  }
                  {this.state.currentStep === 'campaign' &&
                    <Campaign changeCurrentStep={this.changeCurrentStep} msg={this.msg} />
                  }
                  {this.state.currentStep === 'adSet' &&
                    <AdSet changeCurrentStep={this.changeCurrentStep} msg={this.msg} />
                  }
                  <Ad currentStep={this.state.currentStep} changeCurrentStep={this.changeCurrentStep} initialFiles={this.state.initialFiles} msg={this.msg} />
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
    sponsoredMessage: (state.sponsoredMessagingInfo.sponsoredMessage),
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage:updateSponsoredMessage,
    saveDraft: saveDraft,
    send: send
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSponsoredMessage)
