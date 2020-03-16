/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {createURL, editURL, updateData, resetState} from '../../redux/actions/messengerRefURL.actions'
import crypto from 'crypto'
import AlertContainer from 'react-alert'
import Tabs from './tabs'
import Preview from './preview'
import { fetchAllSequence } from '../../redux/actions/sequence.action'

class CreateURL extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageName: ''
    }

    if (props.location.state.module === 'createMessage') {
    //  props.resetState()
      if (props.location.state && props.location.state.pageId) {
        console.log('this.props.messengerRefURL in constructer function if', this.props.messengerRefURL)
        props.updateData(this.props.messengerRefURL, 'pageId', props.location.state.pageId)
      }
      props.fetchAllSequence()
    }
    this.onSave = this.onSave.bind(this)
  }

  componentDidMount () {
    this.setState({pageName:this.props.location.state.pageName})
    console.log('this.props.location.state.messengerRefURL', this.props.location.state.messengerRefURL)
    if (this.props.location.state.module && this.props.location.state.module === 'edit') {
      this.props.updateData('', '', '', {
        pageId: this.props.location.state.messengerRefURL.pageId.pageId === undefined ? this.props.location.state.messengerRefURL.pageId : this.props.location.state.messengerRefURL.pageId.pageId,
        ref_parameter: this.props.location.state.messengerRefURL.ref_parameter,
        reply: this.props.location.state.messengerRefURL.reply,
        sequenceId: this.props.location.state.messengerRefURL.sequenceId
      })
    } else if (this.props.location.state.module && this.props.location.state.module === 'createMessage') {
      console.log('this.props.location.state', this.props.location.state)
      this.props.updateData(this.props.messengerRefURL, 'ref_parameter', this.getRandomString())
      this.props.updateData(this.props.messengerRefURL, 'pageId', this.props.location.state.pageId)
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    if (this.props.location.state.module && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit  Messenger Ref URL`
    } else {
      document.title = `${title} | Create  Messenger Ref URL`
    }
  }

  getRandomString () {
    let today = new Date()
    let uid = crypto.randomBytes(5).toString('hex')
    console.log('f' + uid + '' + today.getFullYear() + '' +
            (today.getMonth() + 1) + '' + today.getDate() + '' +
            today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds())
    return 'f' + uid + '' + today.getFullYear() + '' +
            (today.getMonth() + 1) + '' + today.getDate() + '' +
            today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds()
  }

  onSave () {
    if (this.props.messengerRefURL.ref_parameter === '') {
      return this.msg.error('Custom Ref paramter cannot be empty')
    }
    console.log('this.props.location.state', this.props.location.state)
    console.log('this.props.location.state.messengerRefURL', this.props.location.state.messengerRefURL)
    if (this.props.location.state && this.props.location.state.messengerRefURL && this.props.location.state.module === 'edit') {
      this.props.editURL({
        _id: this.props.location.state.messengerRefURL._id,
        ref_parameter: this.props.messengerRefURL.ref_parameter,
        reply: this.props.messengerRefURL.reply,
        sequenceId: this.props.messengerRefURL.sequenceId
      }, this.msg)
    } else {
      this.props.createURL({
        pageId: this.props.location.state._id,
        ref_parameter: this.props.messengerRefURL.ref_parameter,
        reply: this.props.messengerRefURL.reply,
        sequenceId: this.props.messengerRefURL.sequenceId
      }, this.msg)
    }
  }

  render () {
    console.log('this.props.messengerRefURL in render create function', this.props.messengerRefURL)
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
                        {this.props.location.state.module && this.props.location.state.module === 'edit'
                        ? 'Edit Messenger Ref URL'
                        : 'Create Messenger Ref URL'
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
                  <div className='row'>
                    <Tabs history={this.props.history} location={this.props.location} module={this.props.location.state.module} messengerRefURL={this.props.location.state.messengerRefURL} pageName= {this.state.pageName}/>
                    {
                      this.props.location.state.module === 'edit' ? <Preview history={this.props.history} location={this.props.location} selectedmessengerRefURL={this.props.location.state.messengerRefURL} pageName= {this.state.pageName} /> : <Preview pageName= {this.state.pageName}/>
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
    messengerRefURL: state.messengerRefURLInfo.messengerRefURL,
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createURL: createURL,
    editURL: editURL,
    updateData: updateData,
    resetState: resetState,
    fetchAllSequence: fetchAllSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateURL)
