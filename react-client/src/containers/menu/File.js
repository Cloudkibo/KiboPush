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
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
// import Halogen from 'halogen'

class File extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      errorMsg: '',
      showErrorDialogue: false,
      loading: false,
      showPreview: false
    }
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.setLoading = this.setLoading.bind(this)
  }

  componentDidMount () {
    if (this.props.file && this.props.file !== '') {
      var fileInfo = {
        id: this.props.id,
        componentType: 'file',
        name: this.props.file.fileName,
        type: this.props.file.type,
        size: this.props.file.size,
        url: ''
      }
      if (this.props.file.fileurl) {
        fileInfo.url = this.props.file.fileurl.url
      }
      this.setState({file: fileInfo, showPreview: true})
    }
  }

  showDialog (page) {
    this.setState({showDialog: true})
  }

  closeDialog () {
    this.setState({showDialog: false})
  }

  setLoading () {
    this.setState({loading: false})
  }

  onFilesChange (files) {
    if (files.length > 0) {
      var file = files[files.length - 1]
      this.setState({file: file})
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      var fileInfo = {
        id: this.props.id,
        componentType: 'file',
        fileName: file.name,
        type: file.type,
        size: file.size
      }
      this.setState({loading: true})
      this.props.uploadFile(fileData, fileInfo, this.props.handleFile, this.setLoading)
    }
  }

  onFilesError (error, file) {
    this.setState({errorMsg: error.message, showDialog: true})
  }

  render () {
    return (
      <div>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: 6, marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
          {
            this.state.loading
            ? {/*<div className='align-center'><center><Halogen.RingLoader color='#FF5E3A' /></center></div>*/}
            : <Files
              className='files-dropzone'
              onChange={this.onFilesChange}
              onError={this.onFilesError}
              accepts={['image/*', 'text/*', 'audio/*', 'video/*', 'application/*']}
              maxFileSize={25000000}
              minFileSize={0}
              clickable
          >
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='Text' style={{maxHeight: 40}} />
                <h4 style={{wordBreak: 'break-word'}}>{this.state.file !== '' ? this.state.file.name : 'File'}</h4>
              </div>
            </Files>
          }
          { this.state.showPreview &&
            <div style={{padding: '10px', marginTop: '40px'}}>
              <a href={this.state.file.url} target='_blank' download>
                <h6 style={{wordBreak: 'break-word'}}><i className='fa fa-file-text-o' /><strong> {this.state.file.name} </strong></h6>
              </a>
            </div>
          }
          {/*
          this.state.showDialog &&
          <ModalContainer style={{width: '300px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '300px'}}
              onClose={this.closeDialog}>
              <h3><i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error</h3>
              <p>{this.state.errorMsg}</p>
            </ModalDialog>
          </ModalContainer>
        */}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
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
