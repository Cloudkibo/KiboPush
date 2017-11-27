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
import Halogen from 'halogen'

class Video extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      errorMsg: '',
      showErrorDialogue: false,
      loading: false
    }
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.setLoading = this.setLoading.bind(this)
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

  componentWillReceiveProps (nextProps) {
    if (!nextProps.loading) {
      this.setState({loading: false})
      this.props.setLoading()
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
    console.log(files)
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
        componentType: 'video',
        fileName: file.name,
        type: file.type,
        size: file.size
      }
      console.log(fileInfo)
      this.setState({loading: true})
      this.props.uploadFile(fileData, fileInfo, this.props.handleFile, this.setLoading)
    }
  }

  onFilesError (error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
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
            ? <div className='align-center'><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
            : <Files
              className='files-dropzone'
              onChange={this.onFilesChange}
              onError={this.onFilesError}
              accepts={['video/*']}
              maxFileSize={25000000}
              minFileSize={0}
              clickable
            >
              <div className='align-center'>
                <img src='icons/video.png' alt='Text' style={{maxHeight: 40}} />
                <h4>{this.state.file !== '' ? this.state.file.name : 'Video'}</h4>
              </div>
            </Files>
          }
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
export default connect(mapStateToProps, mapDispatchToProps)(Video)
