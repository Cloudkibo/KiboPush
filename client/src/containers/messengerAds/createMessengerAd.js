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

class CreateMessengerAd extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      previewOptInMessage: [],
      adTitle: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.onSave = this.onSave.bind(this)
    this.updatePreview = this.updatePreview.bind(this)
    if (props.location.state) {
      if (props.location.state._id) {
        props.updateCurrentJsonAd(this.props.messengerAd, 'pageId', props.location.state._id)
      }
      if (props.location.state.module && props.location.state.module === 'edit') {
        props.fetchMessengerAd(props.location.state.jsonAdId, this.updatePreview)
      }
    }
  }
  updatePreview () {
    for (var i = 0; i < this.props.messengerAd.jsonAdMessages.length; i++) {
      if (!this.props.messengerAd.jsonAdMessages[i].jsonAdMessageParentId) {
        this.setState({
          previewOptInMessage: this.props.messengerAd.jsonAdMessages[i].messageContent,
          adTitle: this.props.messengerAd.title
        })
      }
    }
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
    this.updatePreview()
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Messenger Ad`;
  }
  onSave () {
    let payload = {}
    if (!this.state.adTitle || this.state.adTitle === '') {
      this.msg.error('Please enter an Ad Title')
      return
    }
    if (this.props.messengerAd.jsonAdId && this.props.messengerAd.jsonAdId !== '') {
      payload = {jsonAdId: this.props.messengerAd.jsonAdId, title: this.state.adTitle, jsonAdMessages: this.props.messengerAd.jsonAdMessages}
      this.props.editJsonAd(payload, this.msg)
    } else {
      payload = {pageId: this.props.messengerAd.pageId, title: this.state.adTitle, jsonAdMessages: this.props.messengerAd.jsonAdMessages}
      this.props.saveJsonAd(payload, this.msg)
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
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Create Messenger Ad
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
                    <Tabs />
                    <Preview previewOptInMessage={this.state.previewOptInMessage} />
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
