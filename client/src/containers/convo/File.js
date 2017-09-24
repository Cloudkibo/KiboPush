/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import { uploadFile } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import Files from 'react-files'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class File extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      errorMsg: '',
      showErrorDialogue: false
    }
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  showDialog (page) {
    this.setState({showDialog: true})
  }

  closeDialog () {
    this.setState({showDialog: false})
  }

  onFilesChange (files) {
    console.log(files)
    if (files.length > 0) {
      this.setState({file: files[files.length - 1]})
      var fileData = new FormData()
      fileData.append('file', this.state.file)
      fileData.append('filename', this.state.file.name)
      fileData.append('filetype', this.state.file.type)
      fileData.append('filesize', this.state.file.size)
      this.props.uploadFile(fileData)
      var fileInfo = {
        componentType: 'file',
        fileName: this.state.file.name,
        fileurl: this.props.fileUrl,
        type: this.state.file.type,
        size: this.state.file.size
      }
      console.log(fileInfo)
      this.props.handleFile(fileInfo)
    }
  }

  onFilesError (error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
    this.setState({errorMsg: error.message, showDialog: true})
  }

  render () {
    return (
      <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
        <Files
          className='files-dropzone'
          onChange={this.onFilesChange}
          onError={this.onFilesError}
          accepts={['image/*', 'text/*', 'audio/*', 'video/*', 'application/*']}
          maxFileSize={10000000}
          minFileSize={0}
          clickable
        >
          <div className='align-center'>
            <img src='icons/file.png' alt='Text' style={{maxHeight: 40}} />
            <h4>{this.state.file !== '' ? this.state.file.name : 'File'}</h4>
          </div>
        </Files>
        {
          this.state.showDialog &&
          <ModalContainer style={{width: '300px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '300px'}}
              onClose={this.closeDialog}>
              <h3><i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error</h3>
              <p>{this.state.errorMsg}</p>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers),
    fileUrl: (state.convosInfo.fileUrl)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList,
    uploadFile: uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(File)
