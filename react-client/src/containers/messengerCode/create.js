/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { requestMessengerCode, resetState, createCode, updateData, editCode } from '../../redux/actions/messengerCode.actions'
import AlertContainer from 'react-alert'
import Tabs from '../messengerCode/tabs'
import { getFileIdsOfBroadcast, deleteFile, deleteInitialFiles } from '../../utility/utils'

class CreateURL extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      newFiles: [],
      initialFiles: []
    }

    this.onSave = this.onSave.bind(this)
    this.onEditMessage = this.onEditMessage.bind(this)
  }

  onEditMessage () {
    this.editing = true
  }

  onSave () {
    let initialFiles = this.state.initialFiles
    let currentFiles = getFileIdsOfBroadcast(this.props.messengerCode.optInMessage)
    deleteInitialFiles(initialFiles, currentFiles)
    this.setState({newFiles: [], initialFiles: currentFiles})
    var edit = {
      page_id: this.props.messengerCode.pageId,
      pageId: this.props.messengerCode.pageId,
      optInMessage: this.props.messengerCode.optInMessage,
      QRCode: this.props.messengerCode.QRCode,
      newFiles: []
    }
    this.props.updateData(this.props.messengerCode, edit)
    if (this.props.location.state.module && this.props.location.state.module === 'edit') {
      this.props.editCode(this.props.location.state.messengerCode, this.msg)
    }
    else {
      this.props.location.state.module = 'edit'
      this.props.location.state.messengerCode = this.props.messengerCode
      this.props.location.state.messengerCode._id = this.props.messengerCode.pageId
      this.props.createCode(this.props.messengerCode, this.msg)
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
    if (this.props.location.state.module && this.props.location.state.module === 'edit') {
      this.props.updateData(this.props.messengerCode,this.props.location.state.messengerCode)
      document.title = `${title} | Edit  Messenger Code`

    } else {
      document.title = `${title} | Create  Messenger Code`
    }
    if (this.props.location.state.messengerCode) {
      let initialFiles = []
      if (this.props.location.state.initialFiles) {
        initialFiles = this.props.location.state.initialFiles
      } else {
        initialFiles = getFileIdsOfBroadcast(this.props.location.state.messengerCode.optInMessage)
      }
      this.setState({initialFiles})
    }
    if (this.props.messengerCode) {
      this.setState({newFiles: this.props.messengerCode.newFiles})
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
                        ? 'Edit Messenger Code'
                        : 'Create Messenger Code'
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
                    <Tabs 
                      initialFiles={this.state.initialFiles} 
                      newFiles={this.state.newFiles} 
                      onEditMessage={this.onEditMessage} 
                      history={this.props.history} 
                      location={this.props.location} 
                      module={this.props.location.state.module} 
                      selectedPage={this.props.location.state.messengerCode.pageId} />
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
    messengerCode: state.messengerCodeInfo.messengerCode,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    requestMessengerCode: requestMessengerCode,
    resetState: resetState,
    createCode: createCode,
    updateData: updateData,
    editCode: editCode
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateURL)
