/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateCurrentJsonAd, saveJsonAd, fetchMessengerAd, editJsonAd } from '../../redux/actions/messengerAds.actions'
import AlertContainer from 'react-alert'
import Tabs from './tabs'
import Preview from './preview'
import {deleteInitialFiles, getFileIdsOfBroadcast} from '../../utility/utils'

class CreateMessengerAd extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      previewOptInMessage: [],
      adTitle: '',
      setupState: props.location.state && props.location.state.module === 'edit' ? 'true' : 'false'
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.onSave = this.onSave.bind(this)
    this.updatePreview = this.updatePreview.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.switchSetupState = this.switchSetupState.bind(this)
    this.onEditMessage = this.onEditMessage.bind(this)
    console.log(props.location.state)
    console.log(this.props.messengerAd)
    if (props.location.state) {
      if (props.location.state.module && props.location.state.module === 'edit') {
        if (!this.props.messengerAd) {
          props.fetchMessengerAd(props.location.state.jsonAdId, this.updatePreview)
        }
      }
    }
  }

  onEditMessage () {
    this.editing = true
  }

  handleSave () {
    let currentFiles = []
    for (let i = 0; i < this.props.messengerAd.jsonAdMessages.length; i++) {
      currentFiles = currentFiles.concat(getFileIdsOfBroadcast(this.props.messengerAd.jsonAdMessages[i].messageContent))
    }
    deleteInitialFiles(this.state.initialFiles, currentFiles)
    this.setState({
      setupState: 'true',
      adTitle: this.props.messengerAd.title,
      newFiles: [],
      initialFiles: currentFiles
    })
  }
  updatePreview () {
    let initialFiles = []
    if (this.props.location.state.initialFiles) {
      initialFiles = this.props.location.state.initialFiles
    } 
    if (this.props.messengerAd) {
      for (let i = 0; i < this.props.messengerAd.jsonAdMessages.length; i++) {
        if (!this.props.location.state.initialFiles) {
          initialFiles = initialFiles.concat(getFileIdsOfBroadcast(this.props.messengerAd.jsonAdMessages[i].messageContent))
        }
        if (!this.props.messengerAd.jsonAdMessages[i].jsonAdMessageParentId) {
          this.setState({
            previewOptInMessage: this.props.messengerAd.jsonAdMessages[i].messageContent,
            adTitle: this.props.messengerAd.title
          })
        }
      }
      this.setState({ initialFiles, newFiles: this.props.messengerAd.newFiles })
    }
  }
  switchSetupState (value) {
    this.setState({
      setupState: value
    })
  }
  changeTitle (e) {
    this.setState({
      adTitle: e.target.value
    })
    if (e.target.value !== '') {
      this.props.updateCurrentJsonAd(this.props.messengerAd, 'title', e.target.value)
    }
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit JSON Ad`
    } else {
      document.title = `${title} | Create JSON Ad`
    }
    this.updatePreview()
  }
  onSave () {
    let payload = {}
    if (!this.state.adTitle || this.state.adTitle === '') {
      this.msg.error('Please enter an Ad Title')
      return
    }
    if (this.props.messengerAd.jsonAdId && this.props.messengerAd.jsonAdId !== '') {
      payload = {jsonAdId: this.props.messengerAd.jsonAdId, title: this.props.messengerAd.title, jsonAdMessages: this.props.messengerAd.jsonAdMessages}
      this.props.editJsonAd(payload, this.msg, this.handleSave)
    } else {
      payload = {title: this.state.adTitle, jsonAdMessages: this.props.messengerAd.jsonAdMessages}
      this.props.saveJsonAd(payload, this.msg, this.handleSave)
    }
  }

  componentWillUnmount () {
    if (!this.editing) {
      if (this.state.newFiles) {
        for (let i = 0; i < this.state.newFiles.length; i++) {
          deleteFile(this.state.newFiles[i])
        }
      }
    }
  }

  render () {
    console.log('this.state.previewOptInMessage', this.state.previewOptInMessage)
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
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {
                        (this.props.location.state && this.props.location.state.module === 'edit')
                        ? 'Edit JSON Ad'
                        : 'Create JSON Ad'
                      }
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.onSave}>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row' style={{marginBottom: '20px'}}>
                    <label className='col-1 col-form-label'>
                      Ad Title
                    </label>
                    <input id='title'
                      type='text'
                      className='form-control col-5'
                      value={this.state.adTitle}
                      onChange={this.changeTitle}
                    />
                  </div>
                  <div className='row'>
                    <Tabs 
                      onEditMessage={this.onEditMessage} 
                      initialFiles={this.state.initialFiles} 
                      newFiles={this.state.newFiles} 
                      history={this.props.history} 
                      location={this.props.location} 
                      setupState={this.state.setupState} 
                      switchSetupState={this.switchSetupState} 
                      jsonAdId={this.props.location.state ? this.props.location.state.jsonAdId : null} />
                    { (this.props.location.state && this.props.location.state.module === 'edit' && this.state.previewOptInMessage && this.state.previewOptInMessage.length !== 0) ? <Preview previewOptInMessage={this.state.previewOptInMessage} />
                       :<Preview history={this.props.history} location={this.props.location} />
                    }
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
    messengerAd: (state.messengerAdsInfo.messengerAd)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentJsonAd: updateCurrentJsonAd,
    saveJsonAd: saveJsonAd,
    fetchMessengerAd: fetchMessengerAd,
    editJsonAd: editJsonAd
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateMessengerAd)
